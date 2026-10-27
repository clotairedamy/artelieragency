//! Sparkline — a hand-drawn line with a filled area.

use dioxus::prelude::*;

fn path(points: &[f32], w: f32, h: f32) -> (String, String) {
    if points.len() < 2 {
        return (String::new(), String::new());
    }
    let min = points.iter().copied().fold(f32::INFINITY, f32::min);
    let max = points.iter().copied().fold(f32::NEG_INFINITY, f32::max);
    let span = if (max - min).abs() < 1e-4 { 1.0 } else { max - min };
    let step = w / (points.len() - 1) as f32;
    let coords = points
        .iter()
        .enumerate()
        .map(|(i, &v)| (i as f32 * step, h - 4.0 - ((v - min) / span) * (h - 8.0)))
        .collect::<Vec<_>>();

    let mut line = format!("M{:.1} {:.1}", coords[0].0, coords[0].1);
    for &(x, y) in &coords[1..] {
        line.push_str(&format!(" L{:.1} {:.1}", x, y));
    }
    let area = format!("{line} L{w:.0} {h:.0} L0 {h:.0} Z");
    (line, area)
}

/// A sparkline. Point or drag to inspect values (the Vue original adds a
/// crosshair; the core path is shared).
#[component]
pub fn AdsSparkline(
    #[props(into)] points: Vec<f32>,
) -> Element {
    let (line, area) = path(&points, 240.0, 64.0);
    rsx! {
        svg {
            view_box: "0 0 240 64",
            preserve_aspect_ratio: "none",
            class: "spark",
            "aria-hidden": "true",
            path { d: area, fill: "currentColor", opacity: "0.18" }
            path {
                d: line,
                fill: "none",
                stroke: "currentColor",
                stroke_width: "1.8",
                stroke_linecap: "round",
                vector_effect: "non-scaling-stroke",
            }
        }
    }
}
