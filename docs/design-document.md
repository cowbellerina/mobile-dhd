# Dial Home Device Application Design Document

## 1. Application Overview

The Dial Home Device application is an application that simulates a Stargate Dial-Home Device (DHD). Its primary function is to allow users to "dial" Stargate addresses (sequences of unique glyphs) which, when activated, either initiate a phone call to a pre-saved number or prompt the user to save a new glyph-to-phone number mapping. It serves as a creative and themed speed-dialer, leveraging the Stargate universe's aesthetic and sound design.

### 1.1 DHD View

This screen focuses on the circular layout of the DHD and the status display at the top.

+------------------------------------------------------+
|  Status Bar (Time, Battery, etc.)                    |
+------------------------------------------------------+
|                                                      |
|  [ ]  [ ]  [ ]  [ ]  [ ]  [ ]  [ ]      [ ABORT ]    | <-- Header
|  (Chevron Slots - 7 equally spaced)     (Pressable)  |
|                                                      |
+------------------------------------------------------+
|                                                      |
|            . - - - - - - - - - - .                   |
|         .'     [ Outer Ring ]      `.                |
|       /   [G] [G] [G] [G] [G] [G]    \               |
|      |                                |              |
|      |      . - - - - - - - .         |              |
|      |    /   [ Inner Ring ]  \       |              | <-- Main Area
|      |   |    [G] [G] [G]      |      |              |     (DHD)
|      |   |                     |      |              |
|      |   |     ( RED DOME )    |      |              |
|      |   |      Activation     |      |              |
|      |    \       Button      /       |              |
|      |      ` - - - - - - - '         |              |
|      |                                |              |
|       \   [G] [G] [G] [G] [G] [G]    /               |
|         `.                         .'                |
|            ` - - - - - - - - - - '                   |
|                                                      |
+------------------------------------------------------+
|          [ DHD ]          |      Cartouche           | <-- Tab Bar
+------------------------------------------------------+

### 1.2 Cartouche View

This screen acts as a list of saved gate addresses.

+------------------------------------------------------+
|  Status Bar                                          |
+------------------------------------------------------+
|  Title: Cartouche                                    |
+------------------------------------------------------+
|                                                      |
|  +------------------------------------------------+  |
|  |  Jane Doe                                      |  |
|  |  Seq: [G][G][G][G][G][G][G]                    |  | <-- List Item
|  |  Tel: 555-0100                     [ DELETE ]  |  |
|  +------------------------------------------------+  |
|                                                      |
|  +------------------------------------------------+  |
|  |  Matt Smith                                    |  |
|  |  Seq: [G][G][G][G][G][G][G]                    |  |
|  |  Tel: 555-0199                     [ DELETE ]  |  |
|  +------------------------------------------------+  |
|                                                      |
|  +------------------------------------------------+  |
|  |  Camille Camel                                 |  |
|  |  Seq: [G][G][G][G][G][G][G]                    |  |
|  |  Tel: 555-0999                     [ DELETE ]  |  |
|  +------------------------------------------------+  |
|                                                      |
|                  (Empty Space)                       |
|                                                      |
+------------------------------------------------------+
|           DHD             |    [ Cartouche ]         | <-- Tab Bar
+------------------------------------------------------+

## 2. Core Functionality & Business Logic

The application's core business logic revolves around the interaction between the user, the DHD interface, and a persistent "cartouche" (address book) that maps glyph sequences to phone numbers.

### 2.1. Glyph Input and Chevron Display

*   **User Action:** The user interacts with a DHD interface, which presents a circular arrangement of glyph buttons.
*   **Glyph Selection:** Tapping a glyph button adds that glyph to the current dialing sequence.
    *   **Uniqueness Constraint:** A glyph can only be added once per dialing sequence. If a user attempts to select an already-dialed glyph, the action should be ignored.
*   **Visual Feedback:** Upon successful glyph selection:
    *   The selected glyph button is visually highlighted and disabled to prevent re-selection.
    *   A corresponding "chevron" on a separate display area lights up, indicating the position of the glyph in the sequence.
*   **Audio Feedback:** A "Glyph Hit" sound effect is played.
*   **Sequence Limit:** The dialing sequence has a fixed length of **7 glyphs**.

### 2.2. Stargate Activation

*   **Activation Dome:** Once 7 unique glyphs have been successfully dialed, a central "Activation Dome" button becomes active and visually distinct (e.g., lights up).
*   **User Action:** The user presses the Activation Dome.
*   **Pre-Call Preparation:** Before attempting to resolve the address, all glyph buttons on the DHD are disabled to prevent further input.

### 2.3. Address Resolution (Cartouche Lookup)

*   **Cartouche Search:** The application attempts to find a match for the currently dialed 7-glyph sequence within its internal "Cartouche" (persistent storage).
    *   **Matching Logic:** An address matches if the sequence of glyphs (by their unique identifier) is identical to a stored address.
*   **Outcome Handling:**
    *   **Match Found:** If the dialed address matches an entry in the Cartouche:
        *   An "Kawoosh" sound effect is played.
        *   The application proceeds to initiate a phone call using the associated phone number.
    *   **No Match Found:** If the dialed address does not match any entry in the Cartouche:
        *   A "Dial Abort" sound effect is played.
        *   An alert is presented to the user, informing them that the destination is unknown and asking if they would like to map the dialed address to a new destination.

### 2.4. Phone Call Initiation

*   **Mechanism:** When an address is successfully resolved to a phone number, the application attempts to call the associated phone number. This action typically prompts the user's device to initiate a phone call.

### 2.5. New Address Saving (Address Book Integration)

*   **User Prompt:** If an unknown address is dialed, the user is prompted to save it.
*   **User Acceptance:** If the user accepts (e.g., by tapping "Yes, please" on the alert):
    *   The device's native address book (contact picker) is presented to the user.
    *   The contact picker should be configured to allow selection of phone numbers only.
*   **Contact Selection:** The user selects a contact and a specific phone number from their address book.
*   **Cartouche Update:** The selected phone number is then associated with the currently dialed 7-glyph sequence and added as a new entry to the Cartouche.
*   **Persistence:** The updated Cartouche (including the new entry) is saved to persistent storage.

### 2.6. Reset Functionality

*   **User Action:** A "Reset" button is available on the DHD interface.
*   **Functionality:** Pressing the Reset button:
    *   Clears the current dialing sequence (all glyphs are removed from the `Chevrons` model).
    *   Resets the visual state of all glyph buttons (re-enables them and removes highlights).
    *   Deactivates the Activation Dome.

### 2.4. Re-dial Functionality

The Cartouche view supports re-dialing saved addresses with automated glyph entry.

**User Flow:**
1. User swipes **left** on a cartouche item
2. Orange "Dial" action appears with phone icon
3. Tapping navigates to DHD screen
4. Address auto-dials sequentially (1 glyph per second)
5. Each glyph triggers haptic feedback and sound
6. Chevrons illuminate progressively
7. Dome activates after 7 glyphs
8. User manually presses dome to initiate call

**Technical Implementation:**
*   State passed via Expo Router URL parameters
*   Sequential async dialing with 1000ms delays
*   User input blocked during auto-dial sequence
*   Error handling for invalid sequences
*   Haptic feedback: Medium impact per glyph

### 2.5. Swipe Gesture Interactions

Cartouche items support swipe gestures for quick actions:

**Left Swipe (Re-dial):**
*   Orange background (#FF6600)
*   Phone icon with "Dial" text
*   Triggers auto-dial functionality
*   Scale animation on reveal

**Right Swipe (Delete):**
*   Red background (error color)
*   Trash icon with "Delete" text
*   Deletes entry from address book
*   Success haptic notification on delete

**Technical:**
*   Implemented with `react-native-gesture-handler` Swipeable
*   Animated.interpolate for smooth scale transitions
*   100px action width on both sides
*   Prevents overscroll with `overshootLeft/Right: false`

### 2.6. Removing Addresses

*   **User Action:** In the Cartouche View, the user can trigger a delete action on a specific address entry via swipe gesture (swipe right).
*   **System Response:** The application removes the entry from the Cartouche and updates the persistent storage.

## 3. User Interface (UI) Elements

The UI is designed to mimic a Stargate DHD, organized into two primary tabs.

### 3.1. Global Elements
*   **Tab Bar:** Located at the bottom of the screen, allowing navigation between the "DHD" and "Cartouche" views.

### 3.2. DHD View
*   **Header Area:**
    *   **Chevron Display:** A horizontal row of 7 slots. As glyphs are dialed, these slots light up or fill to indicate progress.
    *   **Abort Button:** Located to the right of the chevrons. Clears the current dialing sequence and resets the DHD state.
*   **Main Area (The DHD):**
    *   **Glyph Rings:** Two concentric circles (Outer and Inner) containing the glyph buttons.
    *   **Activation Dome:** A large, central red button. It is inactive until 7 glyphs are dialed. Once active, pressing it attempts to engage the gate.

### 3.3. Cartouche View
*   **Header:** Displays the title "Cartouche".
*   **Address List:** A scrollable list of saved contacts.
    *   **List Item:** Displays the Contact Name, the visual Glyph Sequence, the Phone Number, and a Delete button.

### 3.4. System Integrations
*   **Alerts:** Standard system alerts for "Unknown destination" and other user prompts.
*   **Address Book Picker:** Integration with the device's native contact selection UI.

## 4. Data Model

The data model defines the structures used to represent the DHD's state and the persistent address book.

### 4.1. Glyph

*   **Purpose:** Represents a static definition of a single Stargate glyph available on the DHD.
*   **Attributes:**
    *   `slug` (String): A unique identifier for the glyph (e.g., "glyph-taurus"). This is used for logic, comparison, and storage.
    *   `name` (String): A human-readable name for the glyph (e.g., "Taurus").
    *   `image` (Asset Reference): The reference ID or path to the local image asset (e.g., the result of a `require` call in React Native).

### 4.2. Dialing Sequence (Stargate Address)

*   **Purpose:** Represents a specific combination of glyphs that make up a gate address.
*   **Attributes:**
    *   `glyphs` (Array<String>): An ordered list of exactly 7 Glyph `slug`s.
*   **Constraints:**
    *   Must contain exactly 7 items to be valid for activation.
    *   All items in the list must be unique.

### 4.3. Cartouche Entry

*   **Purpose:** Represents a single, user-saved mapping between a Stargate address and a real-world phone contact.
*   **Attributes:**
    *   `id` (String): A unique identifier (UUID) for this entry.
    *   `name` (String): The name of the destination/contact (e.g., "General Hammond").
    *   `phoneNumber` (String): The phone number to be dialed.
    *   `dialingSequence` (Array<String>): The 7-glyph sequence (stored as slugs) associated with this contact.

### 4.4. Cartouche

*   **Purpose:** The collection of all saved addresses.
*   **Structure:** An Array of `CartoucheEntry` objects.

## 5. Persistence

The application requires persistent storage to retain the user's "Cartouche" (saved addresses) across application restarts.

*   **Technology:** `AsyncStorage` (React Native's simple, unencrypted, asynchronous, persistent, key-value storage system).
*   **Storage Key:** `@dhd_cartouche_v1`
*   **Data Format:** JSON. The `Cartouche` array is serialized into a JSON string before saving.
*   **Lifecycle:**
    *   **Load:** On application launch, the app reads the string from `@dhd_cartouche_v1`, parses it, and hydrates the in-memory state.
    *   **Save:** Whenever a new address is added or an existing one deleted, the updated in-memory list is serialized and written to storage.

## 6. Sound Effects

The application relies on specific sound effects to enhance the user experience and provide feedback:

*   "SG-1-Glyph-Hit-1.wav": Played when a glyph is successfully dialed.
*   "Kawoosh-1.wav": Played when a Stargate address is successfully resolved and a call is initiated.
*   "SG-1-Dial-Abort.wav": Played when a dialed address is not found in the Cartouche.

## 7. Technology Stack

The application is built with modern React Native and Expo technologies:

*   **Core Framework:** React Native 0.81.5
*   **Development Platform:** Expo SDK 54
*   **Language:** TypeScript 5.9 (strict mode)
*   **Routing:** Expo Router 6 (file-based routing)
*   **Gesture Handler:** react-native-gesture-handler 2.28.0
*   **Animations:** react-native-reanimated 4.1.1
*   **Graphics:** react-native-svg 15.12.1
*   **Audio:** expo-audio 1.1.1
*   **Haptics:** expo-haptics 15.0.8
*   **Contacts:** expo-contacts 15.0.11
*   **Storage:** AsyncStorage via @react-native-async-storage/async-storage
*   **Testing:** Jest 29, React Native Testing Library

## 8. Assumptions & Constraints (from original implementation)

*   **Fixed Address Length:** All Stargate addresses are 7 glyphs long.
*   **Unique Glyphs:** Each glyph in a single address must be unique.
*   **Direct Phone Call:** The "activation" triggers a phone call.
*   **Address Book Integration:** Relies on the device's native contact picker for saving new entries.