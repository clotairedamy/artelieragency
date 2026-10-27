//! Widgets: calendar, carousel, resizable, questionnaire, trace.

use dioxus::prelude::*;

use crate::icons::Icon;

/// A month calendar.
#[component]
pub fn AdsCalendar(
    #[props(into, optional)] month_label: Option<String>,
    #[props(into, optional)] days: Option<Vec<Option<u32>>>,
    #[props(optional)] onselect: Option<EventHandler<u32>>,
) -> Element {
    let days = days.unwrap_or_else(|| {
        let mut out = vec![None, None];
        for i in 1..=30 { out.push(Some(i)); }
        out
    });
    let weekdays = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

    rsx! {
        div { class: "calendar",
            if let Some(m) = &month_label { p { class: "cal-month", "{m}" } }
            div { class: "cal-grid",
                for w in weekdays { span { class: "cal-wd", "{w}" } }
                for d in &days {
                    if let Some(n) = d {
                        button {
                            class: "cal-day",
                            r#type: "button",
                            onclick: { let h = onselect.clone(); let v = *n; move |_| { if let Some(h) = &h { h.call(v); } } },
                            "{n}"
                        }
                    } else {
                        span { class: "cal-day empty", "" }
                    }
                }
            }
        }
    }
}

/// A carousel: a horizontal rail with prev/next.
#[component]
pub fn AdsCarousel(
    children: Element,
) -> Element {
    rsx! {
        div { class: "carousel",
            button { class: "car-btn prev", r#type: "button", "aria-label": "Previous", Icon { name: "chevron", size: 16 } }
            div { class: "car-rail", {children} }
            button { class: "car-btn next", r#type: "button", "aria-label": "Next", Icon { name: "chevron", size: 16 } }
        }
    }
}

/// A panel resized by dragging its edge (drag wiring is the consumer's).
#[component]
pub fn AdsResizable(
    children: Element,
) -> Element {
    rsx! {
        div { class: "resizable", style: "width:280px",
            div { class: "res-body", {children} }
            span { class: "res-handle", "aria-hidden": "true" }
        }
    }
}

/// One question in the questionnaire.
#[derive(Clone, PartialEq)]
pub struct Question {
    pub id: String,
    pub text: String,
    pub options: Vec<String>,
}

impl Question {
    #[must_use]
    pub fn new(id: impl Into<String>, text: impl Into<String>, options: Vec<String>) -> Self {
        Self { id: id.into(), text: text.into(), options }
    }
}

/// A questionnaire: one question at a time, with a progress readout.
#[component]
pub fn AdsQuestionnaire(
    #[props(into)] questions: Vec<Question>,
) -> Element {
    let mut step = use_signal(|| 0usize);
    let current = questions.get(*step.read());
    let progress = if questions.is_empty() { 0.0 } else { (*step.read() + 1) as f32 / questions.len() as f32 * 100.0 };
    let n = questions.len();

    rsx! {
        div { class: "q",
            div { class: "q-progress", "aria-hidden": "true", span { class: "q-bar", style: "width:{progress}%" } }
            p { class: "q-count num", "{*step.read() + 1} / {n}" }
            h3 { class: "h3", if let Some(q) = current { "{q.text}" } }
            div { class: "q-opts",
                if let Some(q) = current {
                    for o in &q.options { button { class: "q-opt", r#type: "button", "{o}" } }
                }
            }
            div { class: "q-foot",
                if *step.read() > 0 {
                    button { class: "btn btn-quiet", r#type: "button", onclick: move |_| { let v = *step.read(); step.set(v - 1); }, "Back" }
                }
                button { class: "btn btn-accent", r#type: "button", onclick: move |_| { let v = *step.read(); step.set(v + 1); },
                    if *step.read() + 1 < n { "Next" } else { "Finish" }
                }
            }
        }
    }
}

/// One step in a trace.
#[derive(Clone, PartialEq)]
pub struct TraceStep {
    pub title: String,
    pub meta: Option<String>,
    pub state: String,
}

impl TraceStep {
    #[must_use]
    pub fn new(title: impl Into<String>, state: impl Into<String>) -> Self {
        Self { title: title.into(), meta: None, state: state.into() }
    }
    #[must_use]
    pub fn meta(mut self, meta: impl Into<String>) -> Self {
        self.meta = Some(meta.into());
        self
    }
}

/// A trace: a vertical trail of steps, with a line threading through them.
#[component]
pub fn AdsTrace(
    #[props(into)] steps: Vec<TraceStep>,
) -> Element {
    let n = steps.len();
    rsx! {
        ol { class: "trace",
            for (i, s) in steps.iter().enumerate() {
                li { class: "trace-step {s.state}",
                    span { class: "trace-dot", "aria-hidden": "true" }
                    div { class: "trace-body",
                        span { class: "trace-title", "{s.title}" }
                        if let Some(m) = &s.meta { span { class: "trace-meta num", "{m}" } }
                    }
                    if i + 1 < n { span { class: "trace-line", "aria-hidden": "true" } }
                }
            }
        }
    }
}
