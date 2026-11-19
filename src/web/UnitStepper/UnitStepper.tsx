import React from 'react';
import { ChevronDown } from 'lucide-react';
import { clamp } from '../../primitives/calendarMath';
import '../surface.css';
import './UnitStepper.css';

export interface UnitStepperProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  unit: string;
  /** When given, clicking the unit chip cycles through these. */
  units?: string[];
  onUnitChange?: (unit: string) => void;
  min?: number;
  max?: number;
  step?: number;
  className?: string;
  style?: React.CSSProperties;
}

const RULER_TICKS = 15;

/** Labelled value chip next to a unit chip, with a clickable tick ruler (left = less, right = more). Arrow keys adjust. */
export const UnitStepper: React.FC<UnitStepperProps> = ({
  label, value, onChange, unit, units, onUnitChange, min = 0, max = Number.MAX_SAFE_INTEGER, step = 1, className, style,
}) => {
  const set = (next: number) => onChange(clamp(next, min, max));
  const cycleUnit = () => {
    if (!units || units.length < 2 || !onUnitChange) return;
    onUnitChange(units[(units.indexOf(unit) + 1) % units.length]!);
  };
  const mid = Math.floor(RULER_TICKS / 2);
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') { e.preventDefault(); set(value + step); }
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') { e.preventDefault(); set(value - step); }
  };
  return (
    <section className={['chaos-surface', 'chaos-unit-stepper', className].filter(Boolean).join(' ')} style={style}>
      <span className="chaos-surface__label chaos-unit-stepper__label">{label}</span>
      <div className="chaos-unit-stepper__row">
        <output className="chaos-unit-stepper__chip chaos-unit-stepper__value" aria-live="polite">{value}</output>
        <button
          type="button"
          className="chaos-unit-stepper__chip chaos-unit-stepper__unit"
          disabled={!units}
          onClick={cycleUnit}
        >
          {unit}
          {units && <ChevronDown size={16} aria-hidden="true" />}
        </button>
      </div>
      <div
        className="chaos-unit-stepper__ruler"
        role="slider"
        tabIndex={0}
        aria-label={label}
        aria-valuemin={min}
        aria-valuemax={max === Number.MAX_SAFE_INTEGER ? undefined : max}
        aria-valuenow={value}
        onKeyDown={onKeyDown}
      >
        {Array.from({ length: RULER_TICKS }, (_, i) => {
          const delta = (i - mid) * step;
          const h = i === mid ? 22 : i % 5 === mid % 5 ? 16 : 10;
          return (
            <span key={i} className="chaos-unit-stepper__tick-hit" onClick={() => delta !== 0 && set(value + delta)}>
              <span className={`chaos-unit-stepper__tick${i === mid ? ' chaos-unit-stepper__tick--mid' : ''}`} style={{ height: h }} />
            </span>
          );
        })}
      </div>
    </section>
  );
};
