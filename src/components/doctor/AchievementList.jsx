import React from 'react';

const AchievementList = ({ achievements = [], onEdit, onDelete }) => (
  <div className="bg-card rounded-2xl shadow border border-border p-6 mt-6">
    <h3 className="text-lg font-bold text-card-foreground mb-2">Achievements</h3>
    {achievements.length > 0 ? (
      <ul className="space-y-2">
        {achievements.map((ach, idx) => (
          <li key={idx} className="bg-muted rounded-xl p-3 border border-border flex justify-between items-center">
            <span>
              <span className="font-semibold text-card-foreground">{ach.title}</span> from <span className="text-muted-foreground">{ach.issuer}</span> ({ach.year})
            </span>
          </li>
        ))}
      </ul>
    ) : (
      <p className="text-muted-foreground">No achievements yet.</p>
    )}
  </div>
);

export default AchievementList; 