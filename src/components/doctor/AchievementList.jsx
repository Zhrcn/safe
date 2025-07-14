import React from 'react';
import { Award, Calendar, Star } from 'lucide-react';

const AchievementList = ({ achievements = [], onEdit, onDelete }) => (
  <div className="space-y-4">
    {achievements.length > 0 ? (
      <div className="grid gap-4">
        {achievements.map((ach, idx) => (
          <div key={idx} className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50 hover:shadow-md transition-all duration-300">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <Award className="h-5 w-5 text-yellow-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 text-lg">{ach}</h4>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    ) : (
      <div className="text-center py-8">
        <div className="p-4 bg-gray-50 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
          <Award className="h-8 w-8 text-gray-400" />
        </div>
        <p className="text-gray-500 text-sm">No achievements yet.</p>
        <p className="text-gray-400 text-xs mt-1">Add your professional achievements and certifications</p>
      </div>
    )}
  </div>
  );
  
export default AchievementList; 