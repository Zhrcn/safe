import React from 'react';
import { GraduationCap, Calendar, MapPin } from 'lucide-react';

const EducationList = ({ education = [], onEdit, onDelete }) => (
  <div className="space-y-4">
    {education.length > 0 ? (
      <div className="grid gap-4">
        {education.map((edu, idx) => (
          <div key={idx} className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50 hover:shadow-md transition-all duration-300">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <GraduationCap className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 text-lg">{edu.degree}</h4>
                    <p className="text-blue-600 font-medium">{edu.institution}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600 ml-12">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{edu.yearCompleted}</span>
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
          <GraduationCap className="h-8 w-8 text-gray-400" />
        </div>
        <p className="text-gray-500 text-sm">No education records yet.</p>
        <p className="text-gray-400 text-xs mt-1">Add your educational background to build credibility</p>
      </div>
    )}
  </div>
);

export default EducationList; 