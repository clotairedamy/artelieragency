//! Mobile navigation — a tab bar along the bottom.

use dioxus::prelude::*;

use crate::icons::Icon;
use crate::section::Section;

/// A phone tab bar. Up to four sections, plus "More".
#[component]
pub fn MobileNav(
    #[props(into)] sections: Vec<Section>,
    #[props(default = 0usize)] active: usize,
    #[props(optional)] onselect: Option<EventHandler<usize>>,
) -> Element {
    let tabs = sections.iter().take(4).collect::<Vec<_>>();
    rsx! {
        nav { class: "tabbar", "aria-label": "Primary",
            span { class: "pill", style: "transform:translateX({active * 100}%)", "aria-hidden": "true" }
            for (i, t) in tabs.iter().enumerate() {
                a {
                    class: "tab",
                    class: if i == active { "tab on" } else { "tab" },
                    href: "#{t.id}",
                    onclick: { let h = onselect.clone(); move |_| { if let Some(h) = &h { h.call(i); } } },
                    Icon { name: t.icon.clone(), size: 21 }
                    span { "{t.display()}" }
                }
            }
            button { class: "tab", r#type: "button", "aria-label": "More",
                Icon { name: "grid", size: 21 }
                span { "More" }
            }
        }
    }
}
