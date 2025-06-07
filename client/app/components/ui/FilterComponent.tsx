import React from "react";
import { Filter } from "lucide-react";

interface FilterComponentProps {
  selectedCountry: string;
  setSelectedCountry: (country: string) => void;
  selectedCities: string[];
  setSelectedCities: (cities: string[]) => void;
  duration: [number, number];
  setDuration: (duration: [number, number]) => void;
  budget: [number, number];
  setBudget: (budget: [number, number]) => void;
  countryData: Record<string, string[]>;
  formatPrice: (price: number) => string;
  filteredTours: any[];
}

const FilterComponent: React.FC<FilterComponentProps> = ({
  selectedCountry,
  setSelectedCountry,
  selectedCities,
  setSelectedCities,
  duration,
  setDuration,
  budget,
  setBudget,
  countryData,
  formatPrice,
  filteredTours,
}) => {
  return (
    <div className="w-full lg:w-80 flex-shrink-0">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-32">
        <div className="flex items-center gap-2 mb-6">
          <Filter className="w-5 h-5 text-emerald-600" />
          <h3 className="text-xl font-bold text-gray-900">Filters</h3>
        </div>

        {/*  Destination Filter */}
        {/* <div className="mb-6">
          <h4 className="text-sm font-semibold text-gray-800 mb-3">Destination</h4>
          <div className="space-y-3">
            {Object.keys(countryData).map(country => (
              <label key={country} className="flex items-center cursor-pointer group">
                <input
                  type="radio"
                  name="destination"
                  value={country}
                  checked={selectedCountry === country}
                  onChange={(e) => {
                    setSelectedCountry(e.target.value);
                    setSelectedCities([]);
                  }}
                  className="w-4 h-4 text-emerald-600 focus:ring-emerald-500 focus:ring-2"
                />
                <span className="ml-3 text-sm font-medium text-gray-700 group-hover:text-emerald-600 transition-colors">{country}</span>
              </label>
            ))}
          </div>
        </div> */}

        {/*  Cities Filter */}
        {/* <div className="mb-6">
          <h4 className="text-sm font-semibold text-gray-800 mb-3">Cities</h4>
          <div className="max-h-40 overflow-y-auto space-y-2 pr-2">
            {countryData[selectedCountry].map(city => (
              <label key={city} className="flex items-center cursor-pointer group">
                <input
                  type="checkbox"
                  checked={selectedCities.includes(city)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedCities([...selectedCities, city]);
                    } else {
                      setSelectedCities(selectedCities.filter(c => c !== city));
                    }
                  }}
                  className="w-4 h-4 text-emerald-600 focus:ring-emerald-500 focus:ring-2 rounded"
                />
                <span className="ml-3 text-sm text-gray-600 group-hover:text-emerald-600 transition-colors">{city}</span>
              </label>
            ))}
          </div>
        </div> */}

        {/* Duration Filter */}
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-gray-800 mb-3">
            Duration (nights)
          </h4>
          <div className="px-2">
            <input
              type="range"
              min="1"
              max="14"
              value={duration[1]}
              onChange={(e) => setDuration([1, parseInt(e.target.value)])}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              style={{
                background: `linear-gradient(to right, #10b981 0%, #10b981 ${(duration[1] / 14) * 100}%, #e5e7eb ${(duration[1] / 14) * 100}%, #e5e7eb 100%)`,
              }}
            />
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>1 Night</span>
              <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
                {duration[1]} Nights
              </span>
              <span>14 Nights</span>
            </div>
          </div>
        </div>

        {/*  Budget Filter */}
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-gray-800 mb-3">
            Budget (per person)
          </h4>
          <div className="px-2">
            <input
              type="range"
              min="8000"
              max="300000"
              value={budget[1]}
              onChange={(e) => setBudget([8000, parseInt(e.target.value)])}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              style={{
                background: `linear-gradient(to right, #10b981 0%, #10b981 ${((budget[1] - 8000) / (300000 - 8000)) * 100}%, #e5e7eb ${((budget[1] - 8000) / (300000 - 8000)) * 100}%, #e5e7eb 100%)`,
              }}
            />
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>₹8K</span>
              <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
                ₹{formatPrice(budget[1])}
              </span>
              <span>₹3L</span>
            </div>
          </div>
        </div>

        {/*  Results Counter */}
        <div className="mt-6 p-4 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-lg border border-emerald-200/50">
          <div className="text-center">
            <div className="text-2xl font-bold text-emerald-700">
              {filteredTours.length}
            </div>
            <div className="text-sm text-gray-600">Tours Found</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterComponent;
