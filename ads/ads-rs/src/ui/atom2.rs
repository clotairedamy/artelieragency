//! Small atomics: aspect ratio, bubble, item, marker, direction, label, kbd,
//! spinner, typography.

use dioxus::prelude::*;

use crate::icons::Icon;

/// A container with a fixed aspect ratio.
#[component]
pub fn AdsAspectRatio(
    #[props(into, default = "16 / 9".to_string())] ratio: String,
    children: Element,
) -> Element {
    rsx! { div { class: "aspect", style: "aspect-ratio:{ratio}", {children} } }
}

/// A chat bubble. `mine` puts it on the accent.
#[component]
pub fn AdsBubble(
    #[props(default = false)] mine: bool,
    children: Element,
) -> Element {
    rsx! { div { class: if mine { "bubble mine" } else { "bubble" }, {children} } }
}

/// A list item: an optional glyph, then the body.
#[component]
pub fn AdsItem(
    #[props(into, optional)] icon: Option<String>,
    children: Element,
) -> Element {
    rsx! {
        div { class: "item",
            if let Some(n) = &icon { Icon { name: n.clone(), size: 18 } }
            span { class: "item-body", {children} }
        }
    }
}

/// A status marker: a dot, optionally labelled.
#[component]
pub fn AdsMarker(
    #[props(into, optional)] color: Option<String>,
    #[props(into, optional)] label: Option<String>,
) -> Element {
    let color = color.unwrap_or_else(|| "var(--ok)".to_string());
    rsx! {
        span { class: "marker",
            span { class: "marker-dot", style: "background:{color}", "aria-hidden": "true" }
            if let Some(l) = &label { span { class: "marker-label", "{l}" } }
        }
    }
}

/// A directional hint — an arrow rotated toward `to`.
#[component]
pub fn AdsDirection(
    #[props(into, default = "right".to_string())] to: String,
) -> Element {
    rsx! { span { class: "direction {to}", Icon { name: "arrow", size: 15 } } }
}

/// A form label.
#[component]
pub fn AdsLabel(
    #[props(into, optional)] r#for: Option<String>,
    children: Element,
) -> Element {
    rsx! { label { class: "label", r#for: r#for, {children} } }
}

/// A keyboard key (or keys).
#[component]
pub fn AdsKbd(
    #[props(into, optional)] keys: Option<Vec<String>>,
) -> Element {
    let keys = keys.unwrap_or_else(|| vec!["K".to_string()]);
    rsx! {
        span { class: "kbd-group",
            for k in &keys { kbd { class: "kbd", "{k}" } }
        }
    }
}

/// A bare spinner.
#[component]
pub fn AdsSpinner(
    #[props(default = 18u32)] size: u32,
) -> Element {
    rsx! { span { class: "ads-spinner", style: "width:{size}px;height:{size}px", role: "status", "aria-label": "Loading" } }
}

/// Text in one of the system's type roles.
#[component]
pub fn AdsTypography(
    #[props(into, default = "body".to_string())] role: String,
    children: Element,
) -> Element {
    rsx! { p { class: "type type-{role}", {children} } }
}
