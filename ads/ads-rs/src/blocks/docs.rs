//! Documentation components: shell, nav, callout, window, screenshot.

use dioxus::prelude::*;

use crate::blocks::sections::NavLink;

/// A group in the docs nav.
#[derive(Clone, PartialEq)]
pub struct DocGroup {
    pub title: String,
    pub items: Vec<NavLink>,
}

impl DocGroup {
    #[must_use]
    pub fn new(title: impl Into<String>, items: Vec<NavLink>) -> Self {
        Self { title: title.into(), items }
    }
}

/// A docs shell: side nav and main content.
#[component]
pub fn DocShell(
    children: Element,
) -> Element {
    rsx! { div { class: "docs", {children} } }
}

/// A docs navigation: home link plus grouped links.
#[component]
pub fn DocNav(
    #[props(into)] groups: Vec<DocGroup>,
    #[props(into, optional)] home: Option<(String, String)>,
) -> Element {
    rsx! {
        nav { class: "docs-nav",
            if let Some((to, label)) = &home { a { class: "home", href: "{to}", "{label}" } }
            for g in &groups {
                div { class: "group",
                    p { class: "eyebrow", "{g.title}" }
                    for it in &g.items { a { class: "link", href: "{it.to}", "{it.label}" } }
                }
            }
        }
    }
}

/// A callout: note, tip, or warning.
#[component]
pub fn Callout(
    #[props(into, default = "note".to_string())] kind: String,
    children: Element,
) -> Element {
    let label = match kind.as_str() {
        "tip" => "Tip",
        "warning" => "Warning",
        _ => "Note",
    };
    rsx! {
        div { class: "callout {kind}",
            span { class: "label", "{label}" }
            div { class: "body", {children} }
        }
    }
}

/// A framed app window around an image.
#[component]
pub fn AppWindow(
    #[props(into)] src: String,
    #[props(into)] alt: String,
) -> Element {
    rsx! {
        div { class: "window",
            div { class: "chrome",
                span { class: "dot" } span { class: "dot" } span { class: "dot" }
            }
            div { class: "pane",
                img { src: "{src}", alt: "{alt}", loading: "lazy" }
            }
        }
    }
}

/// A screenshot with an optional caption.
#[component]
pub fn Screenshot(
    #[props(into)] src: String,
    #[props(into)] alt: String,
    #[props(into, optional)] caption: Option<String>,
) -> Element {
    rsx! {
        figure { class: "shot",
            img { src: "{src}", alt: "{alt}", loading: "lazy" }
            if let Some(c) = &caption { figcaption { class: "caption", "{c}" } }
        }
    }
}
