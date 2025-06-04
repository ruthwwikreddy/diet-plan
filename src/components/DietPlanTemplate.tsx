
import React, { useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

type DietPlanProps = {
  initialDietPlan: {
    traineeName: string;
    meals: {
      earlyMorning: { name: string; quantity: string; protein: string; carbs: string; fats: string; calories: string; };
      breakfast: { name: string; quantity: string; protein: string; carbs: string; fats: string; calories: string; };
      snack1: { name: string; quantity: string; protein: string; carbs: string; fats: string; calories: string; };
      lunch: { name: string; quantity: string; protein: string; carbs: string; fats: string; calories: string; };
      preWorkout: { name: string; quantity: string; protein: string; carbs: string; fats: string; calories: string; };
      dinner: { name: string; quantity: string; protein: string; carbs: string; fats: string; calories: string; };
    };
    totals: {
      protein: string;
      carbs: string;
      fats: string;
      calories: string;
    };
  };
  onSave?: (updatedDietPlan: any) => void;
};

const DietPlanTemplate: React.FC<DietPlanProps> = ({ initialDietPlan, onSave }) => {
  const [dietPlan, setDietPlan] = useState(initialDietPlan);
  const [isEditing, setIsEditing] = useState(true);
  const isMobile = useIsMobile();

  const handleInputChange = (mealType: string, field: string, value: string) => {
    setDietPlan(prev => {
      const updatedPlan = { ...prev };
      updatedPlan.meals[mealType][field] = value;
      
      // Update totals if it's a nutritional value
      if (['protein', 'carbs', 'fats', 'calories'].includes(field)) {
        const totalField = field as keyof typeof updatedPlan.totals;
        const total = Object.values(updatedPlan.meals)
          .reduce((sum, meal) => sum + Number(meal[field]), 0);
        updatedPlan.totals[totalField] = total.toString();
      }
      
      return updatedPlan;
    });
  };

  const handleSave = () => {
    if (onSave) {
      onSave(dietPlan);
    }
    setIsEditing(false);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  // Render a table cell - either editable or static
  const renderCell = (mealType: string, field: string, value: string) => {
    if (isEditing) {
      return (
        <input 
          type="text" 
          value={value} 
          onChange={(e) => handleInputChange(mealType, field, e.target.value)}
          className="w-full bg-transparent text-center outline-none focus:ring-1 focus:ring-muscle-red px-1"
        />
      );
    }
    return value;
  };

  return (
    <div className="bg-white max-w-4xl mx-auto font-[Montserrat] px-2 md:px-6">
      {/* Logo Header */}
      <div className="flex items-center justify-between mb-4">
        <div></div> {/* Empty div for spacing */}
        <div className="text-center flex flex-col items-center">
          <img 
            src="/assets/images/Muscle-Works-Logo-e1727793657966.png" 
            alt="Muscle Works Logo" 
            className="h-16 mb-2" 
          />
          <p className="text-sm text-gray-400">The Fitness Coliseum</p>
        </div>
      </div>

      {/* Nutrition Plan Header with Red Border */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-muscle-red mb-2">NUTRITION PLAN</h1>
        <div className="red-dotted-border"></div>
      </div>

      {/* Nutrition Table */}
      <div className="mb-8 overflow-x-auto -mx-6 md:mx-0">
        <table className="w-full nutrition-table border-collapse min-w-[800px] md:min-w-0">
          <thead>
            <tr>
              <th className="w-1/6 text-xs md:text-sm">Meal</th>
              <th className="w-1/6 text-xs md:text-sm">Quantity</th>
              <th className="w-1/6 text-xs md:text-sm">Protein</th>
              <th className="w-1/6 text-xs md:text-sm">{isMobile ? "Carbs" : "Carbo-hydrates"}</th>
              <th className="w-1/6 text-xs md:text-sm">Fats</th>
              <th className="w-1/6 text-xs md:text-sm">Calories</th>
            </tr>
          </thead>
          <tbody>
            {/* Early morning row */}
            <tr>
              <td>
                Early morning:<br />empty stomach
              </td>
              <td>{renderCell('earlyMorning', 'quantity', dietPlan.meals.earlyMorning.quantity)}</td>
              <td>{renderCell('earlyMorning', 'protein', dietPlan.meals.earlyMorning.protein)}</td>
              <td>{renderCell('earlyMorning', 'carbs', dietPlan.meals.earlyMorning.carbs)}</td>
              <td>{renderCell('earlyMorning', 'fats', dietPlan.meals.earlyMorning.fats)}</td>
              <td>{renderCell('earlyMorning', 'calories', dietPlan.meals.earlyMorning.calories)}</td>
            </tr>
            
            {/* Breakfast row */}
            <tr>
              <td>
                <div className="flex flex-col">
                  <span>Breakfast:</span>
                  {renderCell('breakfast', 'name', dietPlan.meals.breakfast.name)}
                </div>
              </td>
              <td>{renderCell('breakfast', 'quantity', dietPlan.meals.breakfast.quantity)}</td>
              <td>{renderCell('breakfast', 'protein', dietPlan.meals.breakfast.protein)}</td>
              <td>{renderCell('breakfast', 'carbs', dietPlan.meals.breakfast.carbs)}</td>
              <td>{renderCell('breakfast', 'fats', dietPlan.meals.breakfast.fats)}</td>
              <td>{renderCell('breakfast', 'calories', dietPlan.meals.breakfast.calories)}</td>
            </tr>
            
            {/* Snack 1 row */}
            <tr>
              <td>
                <div className="flex flex-col">
                  <span>Snack 1:</span>
                  {renderCell('snack1', 'name', dietPlan.meals.snack1.name)}
                </div>
              </td>
              <td>{renderCell('snack1', 'quantity', dietPlan.meals.snack1.quantity)}</td>
              <td>{renderCell('snack1', 'protein', dietPlan.meals.snack1.protein)}</td>
              <td>{renderCell('snack1', 'carbs', dietPlan.meals.snack1.carbs)}</td>
              <td>{renderCell('snack1', 'fats', dietPlan.meals.snack1.fats)}</td>
              <td>{renderCell('snack1', 'calories', dietPlan.meals.snack1.calories)}</td>
            </tr>
            
            {/* Lunch row */}
            <tr>
              <td>
                <div className="flex flex-col">
                  <span>Lunch:</span>
                  {renderCell('lunch', 'name', dietPlan.meals.lunch.name)}
                </div>
              </td>
              <td>{renderCell('lunch', 'quantity', dietPlan.meals.lunch.quantity)}</td>
              <td>{renderCell('lunch', 'protein', dietPlan.meals.lunch.protein)}</td>
              <td>{renderCell('lunch', 'carbs', dietPlan.meals.lunch.carbs)}</td>
              <td>{renderCell('lunch', 'fats', dietPlan.meals.lunch.fats)}</td>
              <td>{renderCell('lunch', 'calories', dietPlan.meals.lunch.calories)}</td>
            </tr>
            
            {/* Pre-workout row */}
            <tr>
              <td>
                <div className="flex flex-col">
                  <span>Pre-workout meal:</span>
                  {renderCell('preWorkout', 'name', dietPlan.meals.preWorkout.name)}
                </div>
              </td>
              <td>{renderCell('preWorkout', 'quantity', dietPlan.meals.preWorkout.quantity)}</td>
              <td>{renderCell('preWorkout', 'protein', dietPlan.meals.preWorkout.protein)}</td>
              <td>{renderCell('preWorkout', 'carbs', dietPlan.meals.preWorkout.carbs)}</td>
              <td>{renderCell('preWorkout', 'fats', dietPlan.meals.preWorkout.fats)}</td>
              <td>{renderCell('preWorkout', 'calories', dietPlan.meals.preWorkout.calories)}</td>
            </tr>
            
            {/* Dinner row */}
            <tr>
              <td>
                <div className="flex flex-col">
                  <span>Dinner:</span>
                  {renderCell('dinner', 'name', dietPlan.meals.dinner.name)}
                </div>
              </td>
              <td>{renderCell('dinner', 'quantity', dietPlan.meals.dinner.quantity)}</td>
              <td>{renderCell('dinner', 'protein', dietPlan.meals.dinner.protein)}</td>
              <td>{renderCell('dinner', 'carbs', dietPlan.meals.dinner.carbs)}</td>
              <td>{renderCell('dinner', 'fats', dietPlan.meals.dinner.fats)}</td>
              <td>{renderCell('dinner', 'calories', dietPlan.meals.dinner.calories)}</td>
            </tr>
            
            {/* Totals row */}
            <tr>
              <td colSpan={2}>Total Calories</td>
              <td>{dietPlan.totals.protein}</td>
              <td>{dietPlan.totals.carbs}</td>
              <td>{dietPlan.totals.fats}</td>
              <td>{dietPlan.totals.calories} KCal</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Edit/Save Controls */}
      {isEditing ? (
        <div className="flex justify-end mt-4">
          <button 
            onClick={handleSave}
            className="bg-muscle-red text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Save
          </button>
        </div>
      ) : (
        <div className="flex justify-end mt-4">
          <button 
            onClick={handleEdit}
            className="bg-muscle-gray text-white px-4 py-2 rounded hover:bg-gray-700"
          >
            Edit
          </button>
        </div>
      )}

      {/* Red Dotted Border */}
      <div className="red-dotted-border mb-6"></div>

      {/* Important Tips Section */}
      <div className="mb-8">
        <h2 className="text-lg md:text-xl font-bold text-muscle-gray mb-4">Important tips:</h2>
        
        <div className="flex items-start mb-4">
          <div className="bg-muscle-gray text-white rounded-full w-8 h-8 flex items-center justify-center mr-4 flex-shrink-0">
            <span>1</span>
          </div>
          <div>
            <p>Don't ever be in situation of starvation mode. Try to keep your meal gap timings between for every 3-4 hours. Where you'll Metabolism get activated. Metabolism is nothing but Bio-Chemical process happen in our body which helps to digest our food by breaking down and transforming it into energy.</p>
          </div>
        </div>
        
        <div className="flex items-start mb-4">
          <div className="bg-muscle-gray text-white rounded-full w-8 h-8 flex items-center justify-center mr-4 flex-shrink-0">
            <span>2</span>
          </div>
          <div>
            <p>For a change in Lunch & Dinner you can add certain Low-Carbohydrates Vegetables like Spinach, Carrot, Onions, Tomatoes, Broccoli's, Cabbage, Cauliflower, Capsicum & Mushrooms.</p>
          </div>
        </div>
        
        <div className="flex items-start mb-4">
          <div className="bg-muscle-gray text-white rounded-full w-8 h-8 flex items-center justify-center mr-4 flex-shrink-0">
            <span>3</span>
          </div>
          <div>
            <p>Vegetarian Protein Sources- Paneer, Tofu, Soya Chunks, Chickpeas, Lentils and Legumes.</p>
          </div>
        </div>
        
        <div className="flex items-start">
          <div className="bg-muscle-gray text-white rounded-full w-8 h-8 flex items-center justify-center mr-4 flex-shrink-0">
            <span>4</span>
          </div>
          <div>
            <p>Cooking Oils- Olive Oil, Ghee, Mustard Oil.</p>
          </div>
        </div>
      </div>

      {/* Red Dotted Border */}
      <div className="red-dotted-border mb-6"></div>

      {/* Mixed Salads Section */}
      <div className="mb-8">
        <h2 className="text-lg md:text-xl font-bold text-muscle-gray mb-4">MIXED SALADS:</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Must Add One Medium Tomato & Onion.</li>
          <li>Half Cucumber + Capsicum or any other Low Carbohydrate Vegetable as mentioned above in tips column + Add Pepper, Salt and Squeeze a lemon for taste.</li>
          <li>Daily water intake should be at least 3-5 Litres in a day.</li>
        </ul>
      </div>

      {/* Food for Brain Section */}
      <div className="mb-8">
        <h2 className="text-lg md:text-xl font-bold text-muscle-gray mb-4">FOOD FOR BRAIN & STRONG BONES:</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Eggs (protein + yolk with choline for memory development)</li>
          <li>Spinach (for new brain cells growth)</li>
          <li>Fish (vitamin D & omega 3 for brain functioning and increase focus)</li>
          <li>Seeds (keep nervous system in check)</li>
          <li>Cereals (heart & brain arteries clear and brain memory)</li>
          <li>Peanuts or almonds (vitamin E, an antioxidant - thiamin for brain nervous system)</li>
          <li>Milk (protein & B vitamins - essential for growth of brain tissues - energy for brain)</li>
          <li>Soybeans (growth of bones and muscles)</li>
        </ul>
      </div>

      {/* Red Dotted Border */}
      <div className="red-dotted-border"></div>

      {/* Footer */}
      <div className="mt-12 mb-6 text-center text-gray-400">
        <img 
          src="/lovable-uploads/5739e01e-5f21-4943-9b4b-dbbccfe35af0.png" 
          alt="Muscle Works Logo" 
          className="h-16 mx-auto mb-2" 
        />
        <p>The Fitness Coliseum</p>
      </div>
    </div>
  );
};

export default DietPlanTemplate;
