//! Accordion, steps, and tree view.

use dioxus::prelude::*;

/// The simplest disclosure, on native details/summary.
#[component]
pub fn AdsAccordion(
    #[props(into)] items: Vec<(String, String)>,
) -> Element {
    rsx! {
        div { class: "ads-accordion",
            for (i, (title, body)) in items.iter().enumerate() {
                details { open: i == 0,
                    summary { "{title}" }
                    div { class: "panel", "{body}" }
                }
            }
        }
    }
}

/// Where you are in a sequence with a known end. Counts discrete stages.
#[component]
pub fn AdsSteps(
    #[props(into)] steps: Vec<Step>,
) -> Element {
    rsx! {
        ol { class: "ads-steps",
            for (i, s) in steps.iter().enumerate() {
                li { class: s.state.class(),
                    span { class: "pip", if s.state == StepState::Done { "✓" } else { "{i + 1}" } }
                    "{s.label}"
                }
            }
        }
    }
}

#[derive(Clone, Copy, PartialEq, Eq)]
pub enum StepState {
    Todo,
    Now,
    Done,
}

impl StepState {
    #[must_use]
    pub const fn class(self) -> &'static str {
        match self {
            Self::Todo => "",
            Self::Now => "is-now",
            Self::Done => "is-done",
        }
    }
}

#[derive(Clone, PartialEq)]
pub struct Step {
    pub label: String,
    pub state: StepState,
}

impl Step {
    #[must_use]
    pub fn new(label: impl Into<String>, state: StepState) -> Self {
        Self { label: label.into(), state }
    }
}

/// A tree node with optional count and children.
#[derive(Clone, PartialEq)]
pub struct TreeNode {
    pub label: String,
    pub count: Option<u32>,
    pub children: Vec<TreeNode>,
}

impl TreeNode {
    #[must_use]
    pub fn leaf(label: impl Into<String>) -> Self {
        Self { label: label.into(), count: None, children: Vec::new() }
    }
    #[must_use]
    pub fn with_count(mut self, count: u32) -> Self {
        self.count = Some(count);
        self
    }
    #[must_use]
    pub fn with_children(mut self, children: Vec<TreeNode>) -> Self {
        self.children = children;
        self
    }
}

fn render_nodes(nodes: &[TreeNode]) -> Element {
    rsx! {
        ul { class: "ads-tree",
            for n in nodes {
                li {
                    span {
                        "{n.label}"
                        if let Some(c) = n.count { span { class: "count", "{c}" } }
                    }
                    if !n.children.is_empty() {
                        {render_nodes(&n.children)}
                    }
                }
            }
        }
    }
}

/// Real nesting — site structure, a category hierarchy, a file system.
#[component]
pub fn AdsTree(
    #[props(into)] nodes: Vec<TreeNode>,
) -> Element {
    render_nodes(&nodes)
}
