import React from "react";

export interface StatsTableProps {
  armorClass?: number;
  hitPoints?: number;
  groundSpeed?: number;
  swimmingSpeed?: number;
  flyingSpeed?: number;
  baseStrength?: number;
  baseDexterity?: number;
  baseConstitution?: number;
  baseIntelligence?: number;
  baseWisdom?: number;
  baseCharisma?: number;
}

function getModifier(score: number = 0) {
  const mod = Math.floor(score / 2) - 5;
  return (mod >= 0 ? "+" : "") + mod;
}

function formatValue(value: number | undefined, suffix: string = ""): string {
  if (value === undefined || value === null) {
    return "UNDEFINED" + (suffix ? " " + suffix : "");
  }
  return value + suffix;
}

function formatAbilityScore(score: number | undefined): string {
  if (score === undefined || score === null) {
    return "UNDEFINED (UNDEFINED)";
  }
  return `${score} (${getModifier(score)})`;
}

function formatCombinedSpeed(groundSpeed?: number, swimmingSpeed?: number, flyingSpeed?: number): string {
  const speeds: string[] = [];
  
  if (groundSpeed && groundSpeed > 0) {
    speeds.push(`${groundSpeed} ft.`);
  }
  
  if (swimmingSpeed && swimmingSpeed > 0) {
    speeds.push(`swim ${swimmingSpeed} ft.`);
  }
  
  if (flyingSpeed && flyingSpeed > 0) {
    speeds.push(`fly ${flyingSpeed} ft.`);
  }
  
  return speeds.length > 0 ? speeds.join(", ") : "UNDEFINED";
}

export const StatsTable: React.FC<StatsTableProps> = ({
  armorClass,
  hitPoints,
  groundSpeed,
  swimmingSpeed,
  flyingSpeed,
  baseStrength,
  baseDexterity,
  baseConstitution,
  baseIntelligence,
  baseWisdom,
  baseCharisma,
}) => (
  <div className="mt-6">
    
    {/* Combat Stats */}
    <div className="mb-4 space-y-1">
      <div className="text-lg">
        <span className="font-medium">Armor Class</span> {formatValue(armorClass)}
      </div>
      <div className="text-lg">
        <span className="font-medium">Hit Points</span> {formatValue(hitPoints)}
      </div>
      <div className="text-lg">
        <span className="font-medium">Speed</span> {formatCombinedSpeed(groundSpeed, swimmingSpeed, flyingSpeed)}
      </div>
    </div>

    <div className="overflow-x-auto">
      <table className="max-w-sm border-collapse">
        <tbody>
          <tr className="border-b">
            <td className="py-2 px-3 font-medium text-center border-r border-white/10">STR</td>
            <td className="py-2 px-3 font-medium text-center border-r border-white/10">DEX</td>
            <td className="py-2 px-3 font-medium text-center border-r border-white/10">CON</td>
            <td className="py-2 px-3 font-medium text-center border-r border-white/10">INT</td>
            <td className="py-2 px-3 font-medium text-center border-r border-white/10">WIS</td>
            <td className="py-2 px-3 font-medium text-center">CHA</td>
          </tr>
          <tr>
            <td className="py-2 px-3 text-center border-r border-white/10">{formatAbilityScore(baseStrength)}</td>
            <td className="py-2 px-3 text-center border-r border-white/10">{formatAbilityScore(baseDexterity)}</td>
            <td className="py-2 px-3 text-center border-r border-white/10">{formatAbilityScore(baseConstitution)}</td>
            <td className="py-2 px-3 text-center border-r border-white/10">{formatAbilityScore(baseIntelligence)}</td>
            <td className="py-2 px-3 text-center border-r border-white/10">{formatAbilityScore(baseWisdom)}</td>
            <td className="py-2 px-3 text-center">{formatAbilityScore(baseCharisma)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
);
