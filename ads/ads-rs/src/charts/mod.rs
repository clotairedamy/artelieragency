//! Hand-drawn charts (bars, sparkline, gauge, heatmap, line), the engagement
//! Gantt chart, and the chart chooser.

pub mod bar;
pub mod chart_choice;
pub mod gantt;
pub mod gauge;
pub mod heatmap;
pub mod line;
pub mod sparkline;

pub use bar::AdsBars;
pub use chart_choice::{ChartChoice, ChartChoiceRow};
pub use gantt::{GanttChart, GanttPhase};
pub use gauge::AdsGauge;
pub use heatmap::AdsHeatmap;
pub use line::AdsLineChart;
pub use sparkline::AdsSparkline;
