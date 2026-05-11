import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../common/Card';
import { Select } from '../common/Select';
import { Button } from '../common/Button';

export const FiltersSidebar = ({ onFilterChange }) => {
  return (
    <Card className="w-full glass sticky top-6">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg flex justify-between items-center">
          Filters
          <Button variant="ghost" size="sm" className="text-xs text-brand-base">Reset</Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2 text-muted-foreground">College Type</label>
          <div className="space-y-2">
            {['Government', 'Government Autonomous', 'Un-Aided', 'Un-Aided Autonomous'].map(type => (
              <label key={type} className="flex items-center gap-2 text-sm cursor-pointer hover:text-brand-base transition-colors">
                <input type="checkbox" className="rounded border-input text-brand-base focus:ring-brand-base bg-background" />
                {type}
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-muted-foreground">Admission Round</label>
          <Select defaultValue="3">
            <option value="1">Round 1</option>
            <option value="2">Round 2</option>
            <option value="3">Round 3</option>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-muted-foreground">Cutoff Year</label>
          <Select defaultValue="2024">
            <option value="2024">2024 (Latest)</option>
            <option value="2023">2023</option>
            <option value="2022">2022</option>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
};
