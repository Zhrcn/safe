import React from 'react';

const EducationList = ({ education = [], onEdit, onDelete }) => (
  <div className="bg-card rounded-2xl shadow border border-border p-6 mt-8">
    <h3 className="text-lg font-bold text-card-foreground mb-2">Education</h3>
    {education.length > 0 ? (
      <ul className="space-y-2">
        {education.map((edu, idx) => (
          <li key={idx} className="bg-muted rounded-xl p-3 border border-border flex justify-between items-center">
            <span>
              <span className="font-semibold text-card-foreground">{edu.degree}</span> at <span className="text-muted-foreground">{edu.institution}</span> ({edu.year})
            </span>
          </li>
        ))}
      </ul>
    ) : (
      <p className="text-muted-foreground">No education records yet.</p>
    )}
  </div>
);

export default EducationList; 