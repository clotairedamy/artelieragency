//! Text field, textarea and select, and the date range.

use dioxus::prelude::*;

use crate::icons::Icon;

#[derive(Default, Clone, Copy, PartialEq, Eq)]
pub enum FieldType {
    #[default]
    Text,
    Email,
    Password,
    Tel,
    Number,
    Search,
    Date,
    Textarea,
    Select,
}

impl FieldType {
    #[must_use]
    pub const fn as_str(self) -> &'static str {
        match self {
            Self::Text => "text",
            Self::Email => "email",
            Self::Password => "password",
            Self::Tel => "tel",
            Self::Number => "number",
            Self::Search => "search",
            Self::Date => "date",
            Self::Textarea => "textarea",
            Self::Select => "select",
        }
    }
}

/// A labelled input, textarea or select. Inputs are wells — the card shape
/// pressed into the page.
#[component]
pub fn AdsField(
    #[props(into, optional)] label: Option<String>,
    #[props(into, optional)] value: Option<String>,
    #[props(into, optional)] placeholder: Option<String>,
    #[props(into, optional)] hint: Option<String>,
    #[props(into, optional)] error: Option<String>,
    #[props(default = FieldType::Text)] field_type: FieldType,
    #[props(into, optional)] options: Option<Vec<String>>,
    #[props(optional)] oninput: Option<EventHandler<FormEvent>>,
) -> Element {
    let class = crate::class::join(&["ads-field", if error.is_some() { "is-invalid" } else { "" }]);

    let control = match field_type {
        FieldType::Textarea => rsx! {
            textarea {
                class: "{class}",
                placeholder: placeholder,
                value: value,
                oninput: move |e| { if let Some(h) = &oninput { h.call(e); } },
            }
        },
        FieldType::Select => rsx! {
            select {
                class: "{class}",
                oninput: move |e| { if let Some(h) = &oninput { h.call(e); } },
                for o in options.unwrap_or_default() {
                    option { value: "{o}", "{o}" }
                }
            }
        },
        _ => rsx! {
            input {
                class: "{class}",
                r#type: field_type.as_str(),
                placeholder: placeholder,
                value: value,
                oninput: move |e| { if let Some(h) = &oninput { h.call(e); } },
            }
        },
    };

    rsx! {
        div { class: "ads-field-group",
            if let Some(l) = &label {
                label { class: "field-label", "{l}" }
            }
            {control}
            if let Some(err) = &error {
                span { class: "field-msg is-error", "{err}" }
            } else if let Some(h) = &hint {
                span { class: "field-msg", "{h}" }
            }
        }
    }
}

/// The most-used control on any dashboard. ISO dates in the data face.
#[component]
pub fn AdsDaterange(
    #[props(into, optional)] from: Option<String>,
    #[props(into, optional)] to: Option<String>,
) -> Element {
    rsx! {
        div { class: "ads-daterange",
            Icon { name: "compass", size: 15 }
            span { class: "num", if let Some(f) = &from { "{f}" } }
            span { class: "sep", "→" }
            span { class: "num", if let Some(t) = &to { "{t}" } }
        }
    }
}
