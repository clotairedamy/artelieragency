//! Checkbox / radio / switch, range, and number stepper.

use dioxus::prelude::*;

use crate::icons::Icon;

#[derive(Default, Clone, Copy, PartialEq, Eq)]
pub enum ChoiceKind {
    #[default]
    Checkbox,
    Radio,
    Switch,
}

/// Checkbox, radio or switch. A switch is for a setting that takes effect
/// immediately; a checkbox is for a value that is submitted.
#[component]
pub fn AdsChoice(
    #[props(into)] label: String,
    #[props(default = false)] checked: bool,
    #[props(default = ChoiceKind::Checkbox)] kind: ChoiceKind,
    #[props(into, optional)] name: Option<String>,
    #[props(optional)] onchange: Option<EventHandler<FormEvent>>,
) -> Element {
    let input_type = if kind == ChoiceKind::Radio { "radio" } else { "checkbox" };
    rsx! {
        label { class: "ads-choice",
            input {
                r#type: input_type,
                name: name,
                checked: checked,
                onchange: move |e| { if let Some(h) = &onchange { h.call(e); } },
            }
            if kind == ChoiceKind::Switch {
                span { class: "ads-switch" }
            } else {
                span { class: if kind == ChoiceKind::Radio { "ads-box is-round" } else { "ads-box" },
                    Icon { name: "check", size: 13 }
                }
            }
            span { class: "choice-label", "{label}" }
        }
    }
}

/// A slider with an accent thumb.
#[component]
pub fn AdsRange(
    #[props(into, optional)] label: Option<String>,
    #[props(default = 0i64)] value: i64,
    #[props(default = 0i64)] min: i64,
    #[props(default = 100i64)] max: i64,
    #[props(default = 1i64)] step: i64,
    #[props(optional)] oninput: Option<EventHandler<FormEvent>>,
) -> Element {
    rsx! {
        div { class: "stack",
            if let Some(l) = &label {
                label { class: "range-label", "{l}" }
            }
            input {
                class: "ads-range",
                r#type: "range",
                min: "{min}",
                max: "{max}",
                step: "{step}",
                value: "{value}",
                oninput: move |e| { if let Some(h) = &oninput { h.call(e); } },
            }
        }
    }
}

/// An inline number input with up/down buttons.
#[component]
pub fn AdsNumber(
    #[props(into, optional)] label: Option<String>,
    #[props(default = 0i64)] value: i64,
    #[props(default = 0i64)] min: i64,
    #[props(default = 999i64)] max: i64,
    #[props(default = 1i64)] step: i64,
    #[props(optional)] oninput: Option<EventHandler<FormEvent>>,
) -> Element {
    rsx! {
        div { class: "stack",
            if let Some(l) = &label {
                label { class: "num-label", "{l}" }
            }
            div { class: "ads-number",
                input {
                    r#type: "number",
                    min: "{min}",
                    max: "{max}",
                    step: "{step}",
                    value: "{value}",
                    oninput: move |e| { if let Some(h) = &oninput { h.call(e); } },
                }
                span { class: "steps",
                    button { r#type: "button", "aria-label": "Increase", "▲" }
                    button { r#type: "button", "aria-label": "Decrease", "▼" }
                }
            }
        }
    }
}
