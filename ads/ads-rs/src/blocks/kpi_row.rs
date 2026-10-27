//! KPI row — the top of nearly every dashboard.

use dioxus::prelude::*;

use crate::ui::AdsStat;

/// One stat tile.
#[derive(Clone, PartialEq)]
pub struct StatItem {
    pub value: String,
    pub label: String,
    pub unit: Option<String>,
    pub note: Option<String>,
}

impl StatItem {
    #[must_use]
    pub fn new(value: impl Into<String>, label: impl Into<String>) -> Self {
        Self { value: value.into(), label: label.into(), unit: None, note: None }
    }
    #[must_use]
    pub fn unit(mut self, unit: impl Into<String>) -> Self {
        self.unit = Some(unit.into());
        self
    }
    #[must_use]
    pub fn note(mut self, note: impl Into<String>) -> Self {
        self.note = Some(note.into());
        self
    }
}

/// Four figures at most, ranked left to right by how often they are the reason
/// someone opened the screen.
#[component]
pub fn KpiRow(
    #[props(into)] items: Vec<StatItem>,
) -> Element {
    rsx! {
        div { class: "kpis",
            for s in &items {
                AdsStat { value: s.value.clone(), label: s.label.clone(), unit: s.unit.clone(), note: s.note.clone() }
            }
        }
    }
}
