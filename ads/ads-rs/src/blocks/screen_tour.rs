//! Screen tour — a tabbed tour of the app, one screen at a time.

use dioxus::prelude::*;

/// One screen in the tour.
#[derive(Clone, PartialEq)]
pub struct TourScreen {
    pub id: String,
    pub label: String,
    pub title: String,
    pub body: String,
}

impl TourScreen {
    #[must_use]
    pub fn new(id: impl Into<String>, label: impl Into<String>, title: impl Into<String>, body: impl Into<String>) -> Self {
        Self { id: id.into(), label: label.into(), title: title.into(), body: body.into() }
    }
}

/// A tabbed tour: a pressed-in segmented control picks the screen, and the
/// copy changes with it. The visual is the children.
#[component]
pub fn ScreenTour(
    #[props(into)] screens: Vec<TourScreen>,
    #[props(default = 0usize)] active: usize,
    #[props(optional)] onchange: Option<EventHandler<usize>>,
    children: Element,
) -> Element {
    let current = screens.get(active);
    rsx! {
        div { class: "tour",
            div { class: "tabs", role: "tablist", "aria-label": "Screens",
                for (i, s) in screens.iter().enumerate() {
                    button {
                        role: "tab",
                        "aria-selected": if i == active { "true" } else { "false" },
                        class: if i == active { "on" } else { "" },
                        onclick: { let h = onchange.clone(); move |_| { if let Some(h) = &h { h.call(i); } } },
                        "{s.label}"
                    }
                }
            }
            div { class: "stage",
                div { class: "copy",
                    h3 { class: "h3", if let Some(s) = current { "{s.title}" } }
                    p { class: "body", if let Some(s) = current { "{s.body}" } }
                }
                div { class: "shot", {children} }
            }
        }
    }
}
