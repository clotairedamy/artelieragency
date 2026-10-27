//! Stat tile, meter, progress, and structured list.

use dioxus::prelude::*;

/// A KPI tile: a figure, its direction of travel, and its standing.
#[component]
pub fn AdsStat(
    #[props(into)] value: String,
    #[props(into)] label: String,
    #[props(into, optional)] unit: Option<String>,
    #[props(into, optional)] note: Option<String>,
) -> Element {
    rsx! {
        div { class: "tile",
            span { class: "eyebrow", "{label}" }
            span { class: "num value",
                "{value}"
                if let Some(u) = &unit { span { class: "unit", "{u}" } }
            }
            if let Some(n) = &note { span { class: "note num", "{n}" } }
        }
    }
}

/// A quantity against a threshold. The mark is what makes the fill meaningful.
#[component]
pub fn AdsMeter(
    #[props(default = 0u32)] value: u32,
    #[props(default = 100u32)] max: u32,
    #[props(optional)] threshold: Option<u32>,
    #[props(into, optional)] label: Option<String>,
) -> Element {
    let pct = if max == 0 { 0 } else { (value * 100 / max).min(100) };
    rsx! {
        div { class: "stack",
            if let Some(l) = &label { span { class: "meter-label", "{l}" } }
            div {
                class: "ads-meter",
                role: "meter",
                "aria-valuenow": "{value}",
                "aria-valuemin": "0",
                "aria-valuemax": "{max}",
                i { style: "width:{pct}%" }
                if let Some(tp) = threshold.map(|t| if max == 0 { 0 } else { t * 100 / max }) {
                    b { style: "left:{tp}%" }
                }
            }
        }
    }
}

/// A task moving toward completion. Distinct from a meter.
#[component]
pub fn AdsProgress(
    #[props(default = 0u32)] value: u32,
    #[props(default = 100u32)] max: u32,
) -> Element {
    let pct = if max == 0 { 0 } else { (value * 100 / max).min(100) };
    rsx! {
        div {
            class: "ads-progress",
            role: "progressbar",
            "aria-valuenow": "{value}",
            "aria-valuemin": "0",
            "aria-valuemax": "{max}",
            i { style: "width:{pct}%" }
        }
    }
}

/// A structured key-value list.
#[component]
pub fn AdsDl(
    #[props(into)] items: Vec<(String, String)>,
) -> Element {
    rsx! {
        dl { class: "ads-dl",
            for (term, value) in &items {
                dt { "{term}" }
                dd { "{value}" }
            }
        }
    }
}

/// A data-grid column.
#[derive(Clone, PartialEq)]
pub struct GridColumn {
    pub key: String,
    pub label: String,
    pub align_end: bool,
}

impl GridColumn {
    #[must_use]
    pub fn new(key: impl Into<String>, label: impl Into<String>) -> Self {
        Self { key: key.into(), label: label.into(), align_end: false }
    }
    #[must_use]
    pub fn end(mut self) -> Self {
        self.align_end = true;
        self
    }
}

/// The workhorse table: sortable headers, rows separated by a whisper, figures
/// monospaced. Rows are aligned to `columns` by index.
#[component]
pub fn AdsDataGrid(
    #[props(into)] columns: Vec<GridColumn>,
    #[props(into)] rows: Vec<Vec<String>>,
) -> Element {
    rsx! {
        div { class: "grid-wrap",
            table {
                thead {
                    tr {
                        for c in &columns {
                            th { class: if c.align_end { "end" } else { "" },
                                button { r#type: "button", "{c.label}", span { class: "caret", "↑" } }
                            }
                        }
                    }
                }
                tbody {
                    for row in &rows {
                        tr {
                            for (i, cell) in row.iter().enumerate() {
                                td { class: if columns.get(i).map(|c| c.align_end).unwrap_or(false) { "num end" } else { "num" }, "{cell}" }
                            }
                        }
                    }
                }
            }
        }
    }
}
