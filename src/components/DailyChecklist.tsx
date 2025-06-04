import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { format } from 'date-fns';
import { Loader2, Save, Plus, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useIsMobile } from '@/hooks/use-mobile';

interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
  trainee_id: string;
  created_at: string;
}

interface DailyChecklistProps {
  traineeId?: string; // Optional: if viewing as a trainer
  readOnly?: boolean; // Optional: if viewing as a trainer
}

const DailyChecklist: React.FC<DailyChecklistProps> = ({ traineeId, readOnly = false }) => {
  const { user } = useAuth();
  const [checklist, setChecklist] = useState<ChecklistItem[]>([]);
  const [newItemText, setNewItemText] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const isMobile = useIsMobile();
  
  const effectiveTraineeId = traineeId || (user?.id as string);
  const today = format(new Date(), 'yyyy-MM-dd');

  // Fetch checklist items
  useEffect(() => {
    if (!effectiveTraineeId) return;
    
    const fetchChecklist = async () => {
      setLoading(true);
      
      try {
        // Get today's checklist items
        const { data, error } = await supabase
          .from('daily_checklist')
          .select('*')
          .eq('trainee_id', effectiveTraineeId)
          .eq('date', today)
          .order('created_at', { ascending: true });
          
        if (error) throw error;
        
        setChecklist(data || []);
      } catch (error) {
        console.error('Error fetching checklist:', error);
        toast({
          title: 'Error',
          description: 'Failed to load your daily checklist.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchChecklist();
    
    // Set up a subscription for real-time updates
    const subscription = supabase
      .channel('daily-checklist-changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'daily_checklist',
          filter: `trainee_id=eq.${effectiveTraineeId}` 
        }, 
        (payload) => {
          fetchChecklist();
        }
      )
      .subscribe();
      
    return () => {
      subscription.unsubscribe();
    };
  }, [effectiveTraineeId, today]);

  // Toggle checklist item completion
  const toggleItem = async (id: string, currentStatus: boolean) => {
    if (readOnly) return;
    
    try {
      const { error } = await supabase
        .from('daily_checklist')
        .update({ completed: !currentStatus })
        .eq('id', id);
        
      if (error) throw error;
      
      // Update local state for immediate feedback
      setChecklist(prev => 
        prev.map(item => 
          item.id === id ? { ...item, completed: !currentStatus } : item
        )
      );
    } catch (error) {
      console.error('Error updating checklist item:', error);
      toast({
        title: 'Error',
        description: 'Failed to update checklist item.',
        variant: 'destructive',
      });
    }
  };

  // Add new checklist item
  const addItem = async () => {
    if (!newItemText.trim() || readOnly) return;
    
    setSaving(true);
    
    try {
      const { data, error } = await supabase
        .from('daily_checklist')
        .insert({
          text: newItemText.trim(),
          completed: false,
          trainee_id: effectiveTraineeId,
          date: today
        })
        .select()
        .single();
        
      if (error) throw error;
      
      // Update local state
      setChecklist(prev => [...prev, data]);
      setNewItemText('');
      
      toast({
        title: 'Success',
        description: 'New checklist item added.',
      });
    } catch (error) {
      console.error('Error adding checklist item:', error);
      toast({
        title: 'Error',
        description: 'Failed to add checklist item.',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  // Delete checklist item
  const deleteItem = async (id: string) => {
    if (readOnly) return;
    
    try {
      const { error } = await supabase
        .from('daily_checklist')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      // Update local state
      setChecklist(prev => prev.filter(item => item.id !== id));
      
      toast({
        title: 'Success',
        description: 'Checklist item removed.',
      });
    } catch (error) {
      console.error('Error deleting checklist item:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete checklist item.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Card className="w-full shadow-md">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl font-bold text-muscle-red">Daily Checklist</CardTitle>
        <CardDescription>
          {readOnly 
            ? "Trainee's progress for today" 
            : "Track your daily nutrition and workout tasks"}
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muscle-red" />
          </div>
        ) : (
          <div className="space-y-3">
            {checklist.length === 0 ? (
              <p className="text-center text-gray-500 py-4">
                {readOnly 
                  ? "No checklist items for today" 
                  : "Add items to your daily checklist"}
              </p>
            ) : (
              checklist.map(item => (
                <div 
                  key={item.id} 
                  className="flex items-center justify-between p-2 rounded-md hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <Checkbox 
                      id={`item-${item.id}`}
                      checked={item.completed}
                      onCheckedChange={() => toggleItem(item.id, item.completed)}
                      disabled={readOnly}
                      className={item.completed ? "bg-muscle-red border-muscle-red" : ""}
                    />
                    <label 
                      htmlFor={`item-${item.id}`}
                      className={`text-sm cursor-pointer ${item.completed ? 'line-through text-gray-500' : ''}`}
                    >
                      {item.text}
                    </label>
                  </div>
                  
                  {!readOnly && (
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => deleteItem(item.id)}
                      className="h-8 w-8 text-gray-500 hover:text-red-500"
                    >
                      <Trash2 size={16} />
                      <span className="sr-only">Delete</span>
                    </Button>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </CardContent>
      
      {!readOnly && (
        <CardFooter className="border-t pt-4">
          <div className="flex w-full space-x-2">
            <Input
              placeholder="Add new checklist item..."
              value={newItemText}
              onChange={(e) => setNewItemText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addItem();
                }
              }}
              className="flex-1"
            />
            <Button 
              onClick={addItem} 
              disabled={!newItemText.trim() || saving}
              className="bg-muscle-red hover:bg-muscle-red/90"
            >
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : isMobile ? (
                <Plus size={18} />
              ) : (
                <>
                  <Plus size={18} className="mr-1" />
                  Add
                </>
              )}
            </Button>
          </div>
        </CardFooter>
      )}
    </Card>
  );
};

export default DailyChecklist;
