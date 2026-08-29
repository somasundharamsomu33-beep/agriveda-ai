import React from "react";
import {
  Ruler,
  SquareDashedBottomCode,
  X,
  Undo2,
  CheckCircle2,
  Sparkles,
  Landmark,
  Calculator,
  Compass,
} from "lucide-react";
import {
  calculatePathDistanceMeters,
  calculatePolygonAreaSqMeters,
  formatAcreageMeasurements,
  formatDistance,
} from "../../lib/geodesic";

export type MeasureMode = "none" | "distance" | "area";

interface MeasureToolProps {
  measureMode: MeasureMode;
  onSetMeasureMode: (mode: MeasureMode) => void;
  points: [number, number][];
  onClearPoints: () => void;
  onUndoPoint: () => void;
  onApplyForAcreage?: (acres: number) => void;
}

export const MeasureTool: React.FC<MeasureToolProps> = ({
  measureMode,
  onSetMeasureMode,
  points,
  onClearPoints,
  onUndoPoint,
  onApplyForAcreage,
}) => {
  const isMeasuring = measureMode !== "none";

  // Calculate live metrics
  const totalDistanceMeters = calculatePathDistanceMeters(points);
  const totalAreaSqMeters =
    measureMode === "area" && points.length >= 3
      ? calculatePolygonAreaSqMeters(points)
      : 0;

  const acreageInfo = formatAcreageMeasurements(totalAreaSqMeters);

  return (
    <>
      {/* Top Floating Measurement Selector Toolbar */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 p-1 bg-slate-900/95 backdrop-blur-md rounded-2xl border border-slate-700/80 shadow-2xl text-white text-xs font-sans">
        <button
          onClick={() => {
            if (measureMode === "area") {
              onSetMeasureMode("none");
              onClearPoints();
            } else {
              onSetMeasureMode("area");
              onClearPoints();
            }
          }}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all ${
            measureMode === "area"
              ? "bg-emerald-600 text-white shadow-md ring-2 ring-emerald-400/40"
              : "text-slate-300 hover:text-white hover:bg-slate-800"
          }`}
          title="Leaflet Farm Plot Area & Acreage Calculator"
        >
          <SquareDashedBottomCode className="w-3.5 h-3.5" />
          <span>Farm Area</span>
          {measureMode === "area" && points.length > 0 && (
            <span className="px-1.5 py-0.2 rounded-md bg-emerald-500/30 text-[10px]">
              {points.length} pts
            </span>
          )}
        </button>

        <button
          onClick={() => {
            if (measureMode === "distance") {
              onSetMeasureMode("none");
              onClearPoints();
            } else {
              onSetMeasureMode("distance");
              onClearPoints();
            }
          }}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all ${
            measureMode === "distance"
              ? "bg-blue-600 text-white shadow-md ring-2 ring-blue-400/40"
              : "text-slate-300 hover:text-white hover:bg-slate-800"
          }`}
          title="Leaflet Distance Ruler"
        >
          <Ruler className="w-3.5 h-3.5" />
          <span>Distance</span>
          {measureMode === "distance" && points.length > 0 && (
            <span className="px-1.5 py-0.2 rounded-md bg-blue-500/30 text-[10px]">
              {points.length} pts
            </span>
          )}
        </button>

        {isMeasuring && (
          <button
            onClick={() => {
              onSetMeasureMode("none");
              onClearPoints();
            }}
            className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800"
            title="Exit Measurement Mode"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Active Measurement Live Metrics HUD Banner */}
      {isMeasuring && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-20 max-w-md w-full bg-slate-900/95 backdrop-blur-xl border border-emerald-500/40 rounded-3xl p-3.5 shadow-2xl text-white animate-in fade-in slide-in-from-top-2 font-sans space-y-2.5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-lg bg-emerald-500/20 text-emerald-400">
                {measureMode === "area" ? (
                  <SquareDashedBottomCode className="w-4 h-4" />
                ) : (
                  <Ruler className="w-4 h-4" />
                )}
              </span>
              <div>
                <h4 className="text-xs font-black uppercase text-white">
                  {measureMode === "area" ? "Farm Plot Geodesic Acreage" : "Distance Ruler"}
                </h4>
                <p className="text-[10px] text-slate-400">
                  {points.length === 0
                    ? "Click on the map to place boundary corner vertices"
                    : `Placed ${points.length} vertices (${points.length < 3 && measureMode === "area" ? `need ${3 - points.length} more` : "complete polygon"})`}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {points.length > 0 && (
                <button
                  onClick={onUndoPoint}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
                  title="Undo Last Point"
                >
                  <Undo2 className="w-3.5 h-3.5" />
                </button>
              )}
              <button
                onClick={onClearPoints}
                className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-[10px] font-bold text-slate-300 hover:text-white"
              >
                Reset
              </button>
            </div>
          </div>

          {/* Area Mode Live Calculations */}
          {measureMode === "area" && (
            <div className="grid grid-cols-3 gap-2 text-center p-2 rounded-2xl bg-slate-950/80 border border-slate-800">
              <div className="border-r border-slate-800">
                <span className="text-[9px] text-slate-400 uppercase font-bold block">Acreage</span>
                <strong className="text-emerald-400 text-sm font-black font-mono">
                  {points.length >= 3 ? acreageInfo.acresFormatted : "--"}
                </strong>
              </div>
              <div className="border-r border-slate-800">
                <span className="text-[9px] text-slate-400 uppercase font-bold block">Hectares / Bigha</span>
                <strong className="text-slate-200 text-xs font-bold font-mono">
                  {points.length >= 3 ? `${acreageInfo.hectaresFormatted} (${acreageInfo.bighaFormatted})` : "--"}
                </strong>
              </div>
              <div>
                <span className="text-[9px] text-slate-400 uppercase font-bold block">Perimeter</span>
                <strong className="text-cyan-400 text-xs font-bold font-mono">
                  {points.length >= 2 ? formatDistance(totalDistanceMeters) : "--"}
                </strong>
              </div>
            </div>
          )}

          {/* Distance Mode Live Calculations */}
          {measureMode === "distance" && (
            <div className="flex items-center justify-between p-2 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs font-mono">
              <span className="text-slate-400">Total Route Length:</span>
              <strong className="text-blue-400 text-sm font-black">
                {formatDistance(totalDistanceMeters)}
              </strong>
            </div>
          )}

          {/* Action to use measured area for loan */}
          {measureMode === "area" && points.length >= 3 && onApplyForAcreage && (
            <div className="pt-1">
              <button
                onClick={() => onApplyForAcreage(acreageInfo.acres)}
                className="w-full py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Calculate Loan for Measured {acreageInfo.acresFormatted}</span>
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
};
