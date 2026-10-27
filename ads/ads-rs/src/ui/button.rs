//! The ADS button and icon button.

use dioxus::prelude::*;

use crate::icons::Icon;

#[derive(Default, Clone, Copy, PartialEq, Eq)]
pub enum ButtonVariant {
    #[default]
    Default,
    Accent,
    Quiet,
}

impl ButtonVariant {
    #[must_use]
    pub const fn as_str(self) -> &'static str {
        match self {
            Self::Default => "btn",
            Self::Accent => "btn btn-accent",
            Self::Quiet => "btn btn-quiet",
        }
    }
}

#[derive(Default, Clone, Copy, PartialEq, Eq)]
pub enum ButtonSize {
    #[default]
    Md,
    Sm,
}

impl ButtonSize {
    #[must_use]
    pub const fn as_str(self) -> &'static str {
        match self {
            Self::Md => "",
            Self::Sm => "btn-sm",
        }
    }
}

/// The ADS button. `Accent` is the one action per screen — spend it once.
#[component]
pub fn AdsButton(
    #[props(default = ButtonVariant::default())] variant: ButtonVariant,
    #[props(default = ButtonSize::default())] size: ButtonSize,
    #[props(into, optional)] icon: Option<String>,
    #[props(optional)] loading: bool,
    #[props(optional)] disabled: bool,
    #[props(into, optional)] button_type: Option<String>,
    #[props(into, optional)] class: Option<String>,
    #[props(optional)] onclick: Option<EventHandler<MouseEvent>>,
    children: Element,
) -> Element {
    let merged = crate::class::join(&[variant.as_str(), size.as_str(), class.as_deref().unwrap_or("")]);
    rsx! {
        button {
            class: "{merged}",
            r#type: button_type.as_deref().unwrap_or("button"),
            disabled: disabled || loading,
            onclick: move |e| { if let Some(h) = &onclick { h.call(e); } },
            if loading {
                span { class: "ads-spinner", "aria-hidden": "true", style: "width:14px;height:14px;border-width:1.5px" }
            } else if let Some(n) = &icon {
                Icon { name: n.clone(), size: 16 }
            }
            {children}
        }
    }
}

/// A button that holds only a glyph. Always carries an accessible name.
#[component]
pub fn AdsIconButton(
    #[props(into)] icon: String,
    #[props(into)] label: String,
    #[props(optional)] round: bool,
    #[props(optional)] accent: bool,
    #[props(default = 18u32)] size: u32,
    #[props(optional)] onclick: Option<EventHandler<MouseEvent>>,
) -> Element {
    let merged = crate::class::join(&[
        "ads-icon-button",
        if round { "is-round" } else { "" },
        if accent { "is-accent" } else { "" },
    ]);
    rsx! {
        button {
            class: "{merged}",
            "aria-label": label,
            onclick: move |e| { if let Some(h) = &onclick { h.call(e); } },
            Icon { name: icon, size }
        }
    }
}
