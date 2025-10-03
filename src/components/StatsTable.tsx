import React from "react";

export interface StatsTableProps {
  armorClass?: number;
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

export const StatsTable: React.FC<StatsTableProps> = ({
  armorClass,
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
    <h3 className="text-lg font-semibold mb-3">Stats</h3>
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b">
            <th className="text-left py-2 px-3 font-medium">Stat</th>
            <th className="text-left py-2 px-3 font-medium">Value</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b">
            <td className="py-2 px-3 font-medium">Armor Class</td>
            <td className="py-2 px-3">{formatValue(armorClass)}</td>
          </tr>
          <tr className="border-b">
            <td className="py-2 px-3 font-medium">Ground Speed</td>
            <td className="py-2 px-3">{formatValue(groundSpeed, "ft.")}</td>
          </tr>
          <tr className="border-b">
            <td className="py-2 px-3 font-medium">Swimming Speed</td>
            <td className="py-2 px-3">{formatValue(swimmingSpeed, "ft.")}</td>
          </tr>
          <tr className="border-b">
            <td className="py-2 px-3 font-medium">Flying Speed</td>
            <td className="py-2 px-3">{formatValue(flyingSpeed, "ft.")}</td>
          </tr>
          <tr className="border-b">
            <td className="py-2 px-3 font-medium">Strength</td>
            <td className="py-2 px-3">{formatAbilityScore(baseStrength)}</td>
          </tr>
          <tr className="border-b">
            <td className="py-2 px-3 font-medium">Dexterity</td>
            <td className="py-2 px-3">{formatAbilityScore(baseDexterity)}</td>
          </tr>
          <tr className="border-b">
            <td className="py-2 px-3 font-medium">Constitution</td>
            <td className="py-2 px-3">{formatAbilityScore(baseConstitution)}</td>
          </tr>
          <tr className="border-b">
            <td className="py-2 px-3 font-medium">Intelligence</td>
            <td className="py-2 px-3">{formatAbilityScore(baseIntelligence)}</td>
          </tr>
          <tr className="border-b">
            <td className="py-2 px-3 font-medium">Wisdom</td>
            <td className="py-2 px-3">{formatAbilityScore(baseWisdom)}</td>
          </tr>
          <tr>
            <td className="py-2 px-3 font-medium">Charisma</td>
            <td className="py-2 px-3">{formatAbilityScore(baseCharisma)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
);
