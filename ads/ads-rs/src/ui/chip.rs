//! Badge, status, and delta.

use dioxus::prelude::*;

/// A count or code pill. Accent is the one number that matters; quiet sits in
/// the chrome.
#[component]
pub fn AdsBadge(
    #[props(into)] value: String,
    #[props(optional)] quiet: bool,
) -> Element {
    let class = crate::class::join(&["ads-badge", if quiet { "is-quiet" } else { "" }]);
    rsx! {
        span { class: "{class}", "{value}" }
    }
}

/// Severity in a monochrome system is luminance: the worse it is, the brighter
/// it is. Always carries a glyph (the dot).
#[component]
pub fn AdsStatus(
    #[props(into)] label: String,
    #[props(default = 1u8)] grade: u8,
) -> Element {
    rsx! {
        span { class: "ads-status g{grade}",
            span { class: "ads-dot" }
            "{label}"
        }
    }
}

/// A change against the previous period. The direction glyph is mandatory.
#[component]
pub fn AdsDelta(
    #[props(into)] value: String,
    #[props(default = DeltaDirection::Flat)] direction: DeltaDirection,
) -> Element {
    rsx! {
        span { class: "ads-delta is-{direction.as_str()}", "{value}" }
    }
}

#[derive(Default, Clone, Copy, PartialEq, Eq)]
pub enum DeltaDirection {
    Up,
    Down,
    #[default]
    Flat,
}

impl DeltaDirection {
    #[must_use]
    pub const fn as_str(self) -> &'static str {
        match self {
            Self::Up => "up",
            Self::Down => "down",
            Self::Flat => "flat",
        }
    }
}

/// A filter the reader applied and can take off again. Distinct from a status
/// chip, which cannot be removed — the dismiss affordance is the difference.
#[component]
pub fn AdsTag(
    #[props(into)] label: String,
    #[props(default = true)] removable: bool,
    #[props(optional)] onremove: Option<EventHandler<MouseEvent>>,
) -> Element {
    rsx! {
        span { class: "ads-tag",
            "{label}"
            if removable {
                button {
                    r#type: "button",
                    "aria-label": "Remove",
                    onclick: move |e| { if let Some(h) = &onremove { h.call(e); } },
                    "×"
                }
            }
        }
    }
}
