//! Gantt chart — an engagement timeline. Phases are stored as fractions of the
//! engagement, so one set of numbers serves every duration.

use dioxus::prelude::*;

/// A phase of the engagement, from/to as fractions (0..1).
#[derive(Clone, PartialEq)]
pub struct GanttPhase {
    pub name: String,
    pub tech: Option<String>,
    pub from: f32,
    pub to: f32,
    pub detail: String,
}

impl GanttPhase {
    #[must_use]
    pub fn new(name: impl Into<String>, from: f32, to: f32) -> Self {
        Self { name: name.into(), tech: None, from, to, detail: String::new() }
    }
    #[must_use]
    pub fn tech(mut self, tech: impl Into<String>) -> Self {
        self.tech = Some(tech.into());
        self
    }
    #[must_use]
    pub fn detail(mut self, detail: impl Into<String>) -> Self {
        self.detail = detail.into();
        self
    }
}

fn default_phases() -> Vec<GanttPhase> {
    vec![
        GanttPhase::new("Discovery & read", 0.0, 0.12),
        GanttPhase::new("Information design", 0.08, 0.3),
        GanttPhase::new("Design system", 0.22, 0.5).tech("Flutter"),
        GanttPhase::new("Interface build", 0.38, 0.84).tech("Flutter"),
        GanttPhase::new("Engine & data", 0.3, 0.72).tech("Rust"),
        GanttPhase::new("Platform build", 0.58, 0.9).tech("iOS"),
        GanttPhase::new("Testing & access", 0.62, 0.96),
        GanttPhase::new("Handover", 0.88, 1.0),
    ]
}

/// An engagement timeline. `weeks` is the number of week columns.
#[component]
pub fn GanttChart(
    #[props(into, optional)] phases: Option<Vec<GanttPhase>>,
    #[props(default = 8u32)] weeks: u32,
) -> Element {
    let phases = phases.unwrap_or_else(default_phases);
    let cols = (1..=weeks).collect::<Vec<_>>();

    rsx! {
        div { class: "gantt card",
            header { class: "head",
                div {
                    span { class: "eyebrow", "Typical engagement" }
                    h3 { class: "h3", "{weeks} weeks, start to handover" }
                }
            }
            div { class: "scroller",
                div { class: "chart",
                    div { class: "names",
                        div { class: "col-head",
                            span { class: "eyebrow", "Phase" }
                            span { class: "eyebrow", "Weeks" }
                        }
                        for p in &phases {
                            div { class: "name-row",
                                span { class: "name",
                                    "{p.name}"
                                    if let Some(t) = &p.tech { span { class: "tech num", "{t}" } }
                                }
                                span { class: "weeks num", "{weeks}" }
                            }
                        }
                    }
                    div { class: "lanes",
                        div { class: "col-head weeks-head",
                            for w in &cols {
                                span { class: "week num", style: "width:{100.0 / weeks as f32}%", "{w}" }
                            }
                        }
                        for p in &phases {
                            div { class: "lane", style: "height:46px",
                                span { class: "bar", style: "left:{p.from * 100.0}%;width:{(p.to - p.from) * 100.0}%",
                                    span { class: "bar-label", if let Some(t) = &p.tech { "{t}" } else { "{p.name}" } }
                                }
                            }
                        }
                    }
                }
            }
            footer { class: "foot",
                p { class: "body readout",
                    span { class: "eyebrow", "Phases" }
                    span { class: "num", "{phases.len()} phases" }
                }
            }
        }
    }
}
