#pragma once
#include <JuceHeader.h>

class PresetDialogTheme : public LookAndFeel_V4 {
public:
    PresetDialogTheme() {
        setTheme(false);
    }

    auto setTheme(bool dark) -> void {
        const auto background = dark ? Colour::fromString("FF220E1A") : Colour::fromString("FFFFBEE6");
        const auto textColor = dark ? Colours::white : Colours::black;
        const auto mainColor = Colour::fromString("FFFF4EA7");

        setColour(AlertWindow::backgroundColourId, background);
        setColour(AlertWindow::textColourId, textColor);
        setColour(Label::textColourId, textColor);
        setColour(Label::textWhenEditingColourId, textColor);

        setColour(TextEditor::backgroundColourId, background.brighter(0.05f));
        setColour(TextEditor::textColourId, textColor);
        setColour(TextEditor::outlineColourId, mainColor);
        setColour(TextEditor::focusedOutlineColourId, mainColor);

        setColour(CaretComponent::caretColourId, mainColor);
        setColour(TextEditor::highlightColourId, mainColor.withAlpha(0.35f));
        setColour(TextEditor::highlightedTextColourId, textColor);

        setColour(TextButton::buttonColourId, mainColor);
        setColour(TextButton::textColourOffId, textColor);
        setColour(TextButton::textColourOnId, textColor);
    }

    auto getAlertWindowTitleFont() -> Font override {
        return FontOptions(26.0f);
    }

    auto getAlertWindowMessageFont() -> Font override {
        return FontOptions(20.0f);
    }

    auto getAlertWindowButtonHeight() -> int override {
        return 30;
    }

    auto drawAlertBox(Graphics& g, AlertWindow& alert,
        const Rectangle<int>& textArea, TextLayout& textLayout) -> void override {
        g.fillAll(findColour(AlertWindow::backgroundColourId));
        textLayout.draw(g, textArea.toFloat());
    }

    auto drawButtonBackground(Graphics& g, Button& button,
        const Colour&, bool isMouseOverButton, bool isButtonDown) -> void override {
        auto bounds = button.getLocalBounds().toFloat();
        auto colour = findColour(TextButton::buttonColourId);

        if (isMouseOverButton) colour = colour.brighter(0.1f);
        if (isButtonDown) colour = colour.darker(0.1f);

        g.setColour(colour);
        g.fillRoundedRectangle(bounds, 8.0f);

        g.setColour(colour.darker(0.2f));
        g.drawRoundedRectangle(bounds.reduced(1.0f), 8.0f, 2.0f);
    }
};