//! Empty state, skeleton, loading, banner, tooltip, modal, drawer, popover.

use dioxus::prelude::*;

use crate::icons::Icon;

/// The first screen every new user sees. It should teach and offer one action.
#[component]
pub fn AdsEmpty(
    #[props(into)] title: String,
    #[props(into, optional)] body: Option<String>,
    #[props(into, default = "discovery".to_string())] icon: String,
    children: Element,
) -> Element {
    rsx! {
        div { class: "ads-empty",
            span { class: "glyph", Icon { name: icon, size: 20 } }
            h4 { "{title}" }
            if let Some(b) = &body { p { "{b}" } }
            {children}
        }
    }
}

/// Holds the layout at the real content's dimensions.
#[component]
pub fn AdsSkeleton(
    #[props(into, default = "100%".to_string())] width: String,
    #[props(into, default = "1em".to_string())] height: String,
) -> Element {
    rsx! {
        div { class: "ads-skeleton", "aria-hidden": "true", style: "width:{width};height:{height}" }
    }
}

/// Inline loading, next to the thing that is loading.
#[component]
pub fn AdsLoading(
    #[props(into, optional)] text: Option<String>,
) -> Element {
    rsx! {
        span { class: "ads-inline-load", role: "status",
            span { class: "ads-spinner", "aria-hidden": "true" }
            if let Some(t) = &text { "{t}" }
        }
    }
}

/// A callout for a condition that persists.
#[component]
pub fn AdsBanner(
    #[props(into)] text: String,
    #[props(into, default = "alert".to_string())] icon: String,
) -> Element {
    rsx! {
        div { class: "ads-banner", role: "status",
            span { class: "glyph", Icon { name: icon, size: 17 } }
            span { "{text}" }
        }
    }
}

/// A bubble on hover/focus that answers a question only if asked. The trigger
/// is the children; the bubble reads `text`.
#[component]
pub fn AdsTooltip(
    #[props(into)] text: String,
    children: Element,
) -> Element {
    rsx! {
        span { class: "tt",
            {children}
            span { class: "bubble", role: "tooltip", "{text}" }
        }
    }
}

/// Blocks everything until answered. Reserved for the few moments that cannot
/// proceed without a decision.
#[component]
pub fn AdsModal(
    #[props(optional)] open: bool,
    #[props(into, optional)] title: Option<String>,
    #[props(optional)] onclose: Option<EventHandler<MouseEvent>>,
    children: Element,
) -> Element {
    rsx! {
        if open {
            div { class: "modal-root",
                div { class: "scrim", onclick: move |e| { if let Some(h) = &onclose { h.call(e); } } }
                div { class: "ads-modal", role: "dialog", "aria-modal": "true",
                    if let Some(t) = &title {
                        header { class: "modal-head",
                            h3 { "{t}" }
                            button { class: "close", r#type: "button", "aria-label": "Close", onclick: move |e| { if let Some(h) = &onclose { h.call(e); } },
                                Icon { name: "plus", size: 16 }
                            }
                        }
                    }
                    {children}
                }
            }
        }
    }
}

/// A right-hand detail panel where the selected row explains itself.
#[component]
pub fn AdsDrawer(
    children: Element,
    panel: Element,
) -> Element {
    rsx! {
        div { class: "ads-drawer",
            div { class: "main", {children} }
            div { class: "panel", {panel} }
        }
    }
}

/// A little extra context anchored to what prompted it.
#[component]
pub fn AdsPopover(
    #[props(into, optional)] label: Option<String>,
    #[props(into, optional)] body: Option<String>,
) -> Element {
    rsx! {
        div { class: "ads-popover",
            if let Some(l) = &label { span { class: "ads-label", "{l}" } }
            if let Some(b) = &body { span { class: "popover-body", "{b}" } }
        }
    }
}
