//! Breadcrumb and pagination.

use dioxus::prelude::*;

/// A breadcrumb trail. Items are (label, optional link).
#[component]
pub fn AdsCrumbs(
    #[props(into)] items: Vec<(String, Option<String>)>,
) -> Element {
    rsx! {
        nav { class: "ads-crumbs", "aria-label": "Breadcrumb",
            for (i, (label, link)) in items.iter().enumerate() {
                if i > 0 {
                    span { class: "sep", "aria-hidden": "true", "/" }
                }
                if let Some(to) = link {
                    a { href: "{to}", "{label}" }
                } else {
                    span { "aria-current": "page", "{label}" }
                }
            }
        }
    }
}

/// Pagination.
#[component]
pub fn AdsPager(
    #[props(default = 1u32)] page: u32,
    #[props(default = 1u32)] pages: u32,
    #[props(optional)] onchange: Option<EventHandler<u32>>,
) -> Element {
    let prev = page.saturating_sub(1).max(1);
    let next = (page + 1).min(pages);
    rsx! {
        nav { class: "ads-pager", "aria-label": "Pagination",
            button { r#type: "button", disabled: page <= 1, onclick: { let h = onchange.clone(); move |_| { if let Some(h) = &h { h.call(prev); } } }, "‹" }
            for n in 1..=pages {
                button {
                    r#type: "button",
                    class: if n == page { "is-on" } else { "" },
                    "aria-current": (n == page).then_some("page"),
                    onclick: { let h = onchange.clone(); move |_| { if let Some(h) = &h { h.call(n); } } },
                    "{n}"
                }
            }
            button { r#type: "button", disabled: page >= pages, onclick: { let h = onchange.clone(); move |_| { if let Some(h) = &h { h.call(next); } } }, "›" }
        }
    }
}
