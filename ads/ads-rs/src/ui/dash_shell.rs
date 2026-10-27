//! Dashboard shell — a rail on the left, the page on a raised frame.

use dioxus::prelude::*;

use crate::icons::Icon;
use crate::section::Section;

/// The window chrome: a rail of sections, the content on a raised panel. The
/// selected row is a tab cut from the frame's own surface.
#[component]
pub fn DashShell(
    #[props(into)] sections: Vec<Section>,
    #[props(default = 0usize)] active: usize,
    #[props(optional)] onselect: Option<EventHandler<usize>>,
    #[props(into, optional)] brand: Option<String>,
    children: Element,
) -> Element {
    let brand = brand.unwrap_or_else(|| "Artelier".to_string());
    rsx! {
        div { class: "shell",
            aside { class: "rail",
                div { class: "rail-brand",
                    span { class: "mark", "aria-hidden": "true",
                        span { class: "mark-dot" }
                    }
                    span { class: "wordmark num", "{brand}" }
                }
                hr { class: "rule" }
                nav { class: "rail-nav", "aria-label": "Sections",
                    span { class: "tab", style: "transform:translateY({active * 62}px)", "aria-hidden": "true",
                        span { class: "fillet fillet-top" }
                        span { class: "fillet fillet-bottom" }
                    }
                    for (i, s) in sections.iter().enumerate() {
                        a {
                            class: if i == active { "nav-item is-active" } else { "nav-item" },
                            href: "#{s.id}",
                            onclick: { let h = onselect.clone(); move |_| { if let Some(h) = &h { h.call(i); } } },
                            span { class: "tile", Icon { name: s.icon.clone(), size: 20 } }
                            span { class: "label", "{s.label}" }
                        }
                    }
                }
            }
            main { class: "panel",
                {children}
            }
        }
    }
}
