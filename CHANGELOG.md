# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Initial setup and general dev #1-16
- Submission details page and CI workflow for checking if CHANGELOG.md is updated
  [#17](https://github.com/thejoltjoker/kreacon/pull/17)
- Logbook script for generating a logbook entry for the day
  [#19](https://github.com/thejoltjoker/kreacon/pull/19)
- User registration and login
  [#20](https://github.com/thejoltjoker/kreacon/pull/20)
- Update navbar and make responsive
  [#21](https://github.com/thejoltjoker/kreacon/pull/21)
- User can create submissions
  [#25](https://github.com/thejoltjoker/kreacon/pull/25)
- Create footer, use ollama for translation, use flex on main layout
  [#27](https://github.com/thejoltjoker/kreacon/pull/27)
- Add pagination
  [#29](https://github.com/thejoltjoker/kreacon/pull/29)
- Add filtering and sorting to submissions page
  [#33](https://github.com/thejoltjoker/kreacon/pull/33)
- Add events page with categories and rules
  [#37](https://github.com/thejoltjoker/kreacon/pull/37)
- Admin list events page
  [#43](https://github.com/thejoltjoker/kreacon/pull/43)
- End-to-end testing
  [#46](https://github.com/thejoltjoker/kreacon/pull/46)
- `DumbSelect` component
  [#48](https://github.com/thejoltjoker/kreacon/pull/48)
- Admin create event page
  [#50](https://github.com/thejoltjoker/kreacon/pull/50)
- Create entity listing for admin pages
  [#50](https://github.com/thejoltjoker/kreacon/pull/50)
- Allow admin to create/edit/delete categories
  [#57](https://github.com/thejoltjoker/kreacon/pull/57)
- Create generic typed form and update login form
  [#60](https://github.com/thejoltjoker/kreacon/pull/60)
- Sprinkle some fairy dust on generic form
  Use context to pass superform data to child components
  [#62](https://github.com/thejoltjoker/kreacon/pull/62)
- Create GitHub action for end-to-end testing and deploying to Azure Web Apps
- Create generic dropdown menu component and use for account menu
  [#66](https://github.com/thejoltjoker/kreacon/pull/66)
- Add tests for admin categories page
  [#68](https://github.com/thejoltjoker/kreacon/pull/68)
- Add actions for submissions page
  [#70](https://github.com/thejoltjoker/kreacon/pull/70)
- Add actions for admin users page
  [#72](https://github.com/thejoltjoker/kreacon/pull/72)
- Add actions for admin tickets page
  [#74](https://github.com/thejoltjoker/kreacon/pull/74)
- `AlertDialog` component, remove admin ability to delete entities
  [#76](https://github.com/thejoltjoker/kreacon/pull/76)
- Add i18n report script to check for missing translations
  [#78](https://github.com/thejoltjoker/kreacon/pull/78)
- Allow user to update username on profile page
  [#82](https://github.com/thejoltjoker/kreacon/pull/82)
- Create landing page
  [#86](https://github.com/thejoltjoker/kreacon/pull/86)
- Add page transitions
  [#89](https://github.com/thejoltjoker/kreacon/pull/89)

### Changed

- Show only published submissions to everyone
  [#31](https://github.com/thejoltjoker/kreacon/pull/31)
- Update layout of submissions page
  [#35](https://github.com/thejoltjoker/kreacon/pull/35)
- Update profile page
  [#39](https://github.com/thejoltjoker/kreacon/pull/39)
- Update single user page
  [#41](https://github.com/thejoltjoker/kreacon/pull/41)
- Refactor layout and unify navbar
  [#44](https://github.com/thejoltjoker/kreacon/pull/44)
- Update admin events page, with new form
  [#69](https://github.com/thejoltjoker/kreacon/pull/69)
- Update user create submission page with multi step form
  [#84](https://github.com/thejoltjoker/kreacon/pull/84)
- Change name of submissions to entries
  [#88](https://github.com/thejoltjoker/kreacon/pull/88)
- Fix bugs on single entry page
  [#91](https://github.com/thejoltjoker/kreacon/pull/91)

### Deprecated

- Features that will be removed in upcoming releases

### Removed

- Removed the abundance of seed data to shorten time for testing
  [#80](https://github.com/thejoltjoker/kreacon/pull/80)

### Fixed

- Bug fixes

### Security

- Security vulnerability fixes

## [0.0.1] - 2024-11-25

### Added

- Initial setup and general dev #1-16

[Unreleased]: https://github.com/thejoltjoker/kreacon/compare/v0.0.1...HEAD
[0.0.1]: https://github.com/thejoltjoker/kreacon/releases/tag/v0.0.1
