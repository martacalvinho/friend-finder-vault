import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Label } from "./ui/label";
import { DatePicker } from "./ui/date-picker";
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";
import { Calendar, Check, X } from "lucide-react";

interface SearchFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedCategory: string;
  onCategoryChange: (value: string) => void;
  selectedStatus: string;
  onStatusChange: (value: string) => void;
  selectedFriend: string | null;
  onFriendChange: (value: string | null) => void;
  startDate: Date | null;
  endDate: Date | null;
  onDateChange: (start: Date | null, end: Date | null) => void;
  friends: string[];
}

export const SearchFilters = ({
  searchTerm,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedStatus,
  onStatusChange,
  selectedFriend,
  onFriendChange,
  startDate,
  endDate,
  onDateChange,
  friends,
}: SearchFiltersProps) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Search Input */}
        <div className="space-y-2">
          <Label>Search</Label>
          <Input
            placeholder="Search recommendations..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        {/* Category Filter */}
        <div className="space-y-2">
          <Label>Category</Label>
          <Select value={selectedCategory} onValueChange={onCategoryChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="movie">Movies</SelectItem>
              <SelectItem value="book">Books</SelectItem>
              <SelectItem value="restaurant">Restaurants</SelectItem>
              <SelectItem value="travel">Travel</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Friend Filter */}
        <div className="space-y-2">
          <Label>Friend</Label>
          <Select 
            value={selectedFriend || ''} 
            onValueChange={(value) => onFriendChange(value === 'all' ? null : value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select friend" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Friends</SelectItem>
              {friends.map((friend) => (
                <SelectItem key={friend} value={friend}>
                  {friend}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Date Range */}
        <div className="space-y-2">
          <Label>Date Range</Label>
          <div className="flex gap-2">
            <DatePicker
              date={startDate}
              onDateChange={(date) => onDateChange(date, endDate)}
              placeholder="Start date"
            />
            <DatePicker
              date={endDate}
              onDateChange={(date) => onDateChange(startDate, date)}
              placeholder="End date"
            />
          </div>
        </div>
      </div>

      {/* Status Toggle */}
      <div className="space-y-2">
        <Label>Status</Label>
        <ToggleGroup 
          type="single" 
          value={selectedStatus}
          onValueChange={(value) => value && onStatusChange(value)}
          className="justify-start"
        >
          <ToggleGroupItem value="all" aria-label="Show all recommendations">
            All
          </ToggleGroupItem>
          <ToggleGroupItem value="used" aria-label="Show used recommendations">
            <Check className="h-4 w-4 mr-1" />
            Used
          </ToggleGroupItem>
          <ToggleGroupItem value="unused" aria-label="Show unused recommendations">
            <X className="h-4 w-4 mr-1" />
            Not Used
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
    </div>
  );
};