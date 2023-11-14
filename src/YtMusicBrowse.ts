export interface YtMusicBrowse {
    responseContext: ResponseContext;
    contents:        Contents;
    header:          Header;
    trackingParams:  string;
    microformat:     Microformat;
}

export interface Contents {
    singleColumnBrowseResultsRenderer: SingleColumnBrowseResultsRenderer;
}

export interface SingleColumnBrowseResultsRenderer {
    tabs: Tab[];
}

export interface Tab {
    tabRenderer: TabRenderer;
}

export interface TabRenderer {
    content:        TabRendererContent;
    trackingParams: string;
}

export interface TabRendererContent {
    sectionListRenderer: SectionListRenderer;
}

export interface SectionListRenderer {
    contents:       SectionListRendererContent[];
    trackingParams: string;
}

export interface SectionListRendererContent {
    musicShelfRenderer: MusicShelfRenderer;
}

export interface MusicShelfRenderer {
    contents:                MusicShelfRendererContent[];
    trackingParams:          string;
    shelfDivider:            ShelfDivider;
    contentsMultiSelectable: boolean;
}

export interface MusicShelfRendererContent {
    musicResponsiveListItemRenderer: MusicResponsiveListItemRenderer;
}

export interface MusicResponsiveListItemRenderer {
    trackingParams:      string;
    overlay:             Overlay;
    flexColumns:         FlexColumn[];
    fixedColumns:        FixedColumn[];
    menu:                MusicResponsiveListItemRendererMenu;
    badges:              Badge[];
    playlistItemData:    PlaylistItemData;
    itemHeight:          ItemHeight;
    index:               Description;
    multiSelectCheckbox: MultiSelectCheckbox;
}

export interface Badge {
    musicInlineBadgeRenderer: MusicInlineBadgeRenderer;
}

export interface MusicInlineBadgeRenderer {
    trackingParams:    string;
    icon:              Icon;
    accessibilityData: AccessibilityPauseDataClass;
}

export interface AccessibilityPauseDataClass {
    accessibilityData: AccessibilityAccessibilityData;
}

export interface AccessibilityAccessibilityData {
    label: string;
}

export interface Icon {
    iconType: IconType;
}

export enum IconType {
    AddToPlaylist = "ADD_TO_PLAYLIST",
    AddToRemoteQueue = "ADD_TO_REMOTE_QUEUE",
    Artist = "ARTIST",
    Collapse = "COLLAPSE",
    Expand = "EXPAND",
    LibraryAdd = "LIBRARY_ADD",
    LibrarySaved = "LIBRARY_SAVED",
    Mix = "MIX",
    MusicExplicitBadge = "MUSIC_EXPLICIT_BADGE",
    MusicShuffle = "MUSIC_SHUFFLE",
    Pause = "PAUSE",
    PlayArrow = "PLAY_ARROW",
    QueuePlayNext = "QUEUE_PLAY_NEXT",
    Share = "SHARE",
    VolumeUp = "VOLUME_UP",
}

export interface FixedColumn {
    musicResponsiveListItemFixedColumnRenderer: MusicResponsiveListItemFixedColumnRenderer;
}

export interface MusicResponsiveListItemFixedColumnRenderer {
    text:            Description;
    displayPriority: DisplayPriority;
    size:            Size;
}

export enum DisplayPriority {
    MusicResponsiveListItemColumnDisplayPriorityHigh = "MUSIC_RESPONSIVE_LIST_ITEM_COLUMN_DISPLAY_PRIORITY_HIGH",
}

export enum Size {
    MusicResponsiveListItemFixedColumnSizeSmall = "MUSIC_RESPONSIVE_LIST_ITEM_FIXED_COLUMN_SIZE_SMALL",
}

export interface Description {
    runs: DescriptionRun[];
}

export interface DescriptionRun {
    text: string;
}

export interface FlexColumn {
    musicResponsiveListItemFlexColumnRenderer: MusicResponsiveListItemFlexColumnRenderer;
}

export interface MusicResponsiveListItemFlexColumnRenderer {
    text:            Text;
    displayPriority: DisplayPriority;
}

export interface Text {
    runs?: PurpleRun[];
}

export interface PurpleRun {
    text:               string;
    navigationEndpoint: NavigationEndpoint;
}

export interface NavigationEndpoint {
    clickTrackingParams: string;
    watchEndpoint:       WatchEndpoint;
}

export interface WatchEndpoint {
    videoId:                            string;
    playlistId:                         string;
    loggingContext:                     LoggingContext;
    watchEndpointMusicSupportedConfigs: WatchEndpointMusicSupportedConfigs;
    params?:                            string;
    playlistSetVideoId?:                string;
}

export interface LoggingContext {
    vssLoggingContext: VssLoggingContext;
}

export interface VssLoggingContext {
    serializedContextData: string;
}

export interface WatchEndpointMusicSupportedConfigs {
    watchEndpointMusicConfig: WatchEndpointMusicConfig;
}

export interface WatchEndpointMusicConfig {
    musicVideoType: MusicVideoType;
}

export enum MusicVideoType {
    MusicVideoTypeAtv = "MUSIC_VIDEO_TYPE_ATV",
}

export enum ItemHeight {
    MusicResponsiveListItemHeightMedium = "MUSIC_RESPONSIVE_LIST_ITEM_HEIGHT_MEDIUM",
}

export interface MusicResponsiveListItemRendererMenu {
    menuRenderer: PurpleMenuRenderer;
}

export interface PurpleMenuRenderer {
    items:           PurpleItem[];
    trackingParams:  string;
    topLevelButtons: PurpleTopLevelButton[];
    accessibility:   AccessibilityPauseDataClass;
}

export interface PurpleItem {
    menuNavigationItemRenderer?:    MenuItemRenderer;
    menuServiceItemRenderer?:       MenuItemRenderer;
    toggleMenuServiceItemRenderer?: ToggleMenuServiceItemRenderer;
}

export interface MenuItemRenderer {
    text:                Description;
    icon:                Icon;
    navigationEndpoint?: MenuNavigationItemRendererNavigationEndpoint;
    trackingParams:      string;
    serviceEndpoint?:    MenuNavigationItemRendererServiceEndpoint;
}

export interface MenuNavigationItemRendererNavigationEndpoint {
    clickTrackingParams:    string;
    watchEndpoint?:         WatchEndpoint;
    addToPlaylistEndpoint?: Endpoint;
    browseEndpoint?:        BrowseEndpoint;
    shareEntityEndpoint?:   ShareEntityEndpoint;
    watchPlaylistEndpoint?: WatchPlaylistEndpoint;
}

export interface Endpoint {
    videoId?:    string;
    playlistId?: string;
}

export interface BrowseEndpoint {
    browseId:                              string;
    browseEndpointContextSupportedConfigs: BrowseEndpointContextSupportedConfigs;
}

export interface BrowseEndpointContextSupportedConfigs {
    browseEndpointContextMusicConfig: BrowseEndpointContextMusicConfig;
}

export interface BrowseEndpointContextMusicConfig {
    pageType: PageType;
}

export enum PageType {
    MusicPageTypeArtist = "MUSIC_PAGE_TYPE_ARTIST",
}

export interface ShareEntityEndpoint {
    serializedShareEntity: string;
    sharePanelType:        SharePanelType;
}

export enum SharePanelType {
    SharePanelTypeUnifiedSharePanel = "SHARE_PANEL_TYPE_UNIFIED_SHARE_PANEL",
}

export interface WatchPlaylistEndpoint {
    playlistId: string;
    params:     string;
}

export interface MenuNavigationItemRendererServiceEndpoint {
    clickTrackingParams: string;
    queueAddEndpoint:    QueueAddEndpoint;
}

export interface QueueAddEndpoint {
    queueTarget:         QueueTarget;
    queueInsertPosition: QueueInsertPosition;
    commands:            Command[];
}

export interface Command {
    clickTrackingParams: string;
    addToToastAction:    AddToToastAction;
}

export interface AddToToastAction {
    item: AddToToastActionItem;
}

export interface AddToToastActionItem {
    notificationTextRenderer: NotificationTextRenderer;
}

export interface NotificationTextRenderer {
    successResponseText: Description;
    trackingParams:      string;
}

export enum QueueInsertPosition {
    InsertAfterCurrentVideo = "INSERT_AFTER_CURRENT_VIDEO",
    InsertAtEnd = "INSERT_AT_END",
}

export interface QueueTarget {
    videoId?:     string;
    onEmptyQueue: OnEmptyQueue;
    playlistId?:  string;
}

export interface OnEmptyQueue {
    clickTrackingParams: string;
    watchEndpoint:       Endpoint;
}

export interface ToggleMenuServiceItemRenderer {
    defaultText:            Description;
    defaultIcon:            Icon;
    defaultServiceEndpoint: ToggleMenuServiceItemRendererDefaultServiceEndpoint;
    toggledText:            Description;
    toggledIcon:            Icon;
    toggledServiceEndpoint: ToggleMenuServiceItemRendererDefaultServiceEndpoint;
    trackingParams:         string;
}

export interface ToggleMenuServiceItemRendererDefaultServiceEndpoint {
    clickTrackingParams: string;
    feedbackEndpoint:    FeedbackEndpoint;
}

export interface FeedbackEndpoint {
    feedbackToken: string;
}

export interface PurpleTopLevelButton {
    likeButtonRenderer: LikeButtonRenderer;
}

export interface LikeButtonRenderer {
    target:           Target;
    likeStatus:       Status;
    trackingParams:   string;
    likesAllowed:     boolean;
    serviceEndpoints: ServiceEndpointElement[];
}

export enum Status {
    Dislike = "DISLIKE",
    Indifferent = "INDIFFERENT",
    Like = "LIKE",
}

export interface ServiceEndpointElement {
    clickTrackingParams: string;
    likeEndpoint:        ServiceEndpointLikeEndpoint;
}

export interface ServiceEndpointLikeEndpoint {
    status:   Status;
    target:   Target;
    actions?: Action[];
}

export interface Action {
    clickTrackingParams:             string;
    musicLibraryStatusUpdateCommand: MusicLibraryStatusUpdateCommand;
}

export interface MusicLibraryStatusUpdateCommand {
    libraryStatus:             LibraryStatus;
    addToLibraryFeedbackToken: string;
}

export enum LibraryStatus {
    MusicLibraryStatusInLibrary = "MUSIC_LIBRARY_STATUS_IN_LIBRARY",
}

export interface Target {
    videoId: string;
}

export interface MultiSelectCheckbox {
    checkboxRenderer: CheckboxRenderer;
}

export interface CheckboxRenderer {
    onSelectionChangeCommand: OnSelectionChangeCommand;
    checkedState:             CheckedState;
    trackingParams:           string;
}

export enum CheckedState {
    CheckboxCheckedStateUnchecked = "CHECKBOX_CHECKED_STATE_UNCHECKED",
}

export interface OnSelectionChangeCommand {
    clickTrackingParams:           string;
    updateMultiSelectStateCommand: UpdateMultiSelectStateCommand;
}

export interface UpdateMultiSelectStateCommand {
    multiSelectParams: string;
    multiSelectItem:   string;
}

export interface Overlay {
    musicItemThumbnailOverlayRenderer: MusicItemThumbnailOverlayRenderer;
}

export interface MusicItemThumbnailOverlayRenderer {
    background:      Background;
    content:         MusicItemThumbnailOverlayRendererContent;
    contentPosition: ContentPosition;
    displayStyle:    DisplayStyle;
}

export interface Background {
    verticalGradient: VerticalGradient;
}

export interface VerticalGradient {
    gradientLayerColors: string[];
}

export interface MusicItemThumbnailOverlayRendererContent {
    musicPlayButtonRenderer: MusicPlayButtonRenderer;
}

export interface MusicPlayButtonRenderer {
    playNavigationEndpoint: NavigationEndpoint;
    trackingParams:         string;
    playIcon:               Icon;
    pauseIcon:              Icon;
    iconColor:              number;
    backgroundColor:        number;
    activeBackgroundColor:  number;
    loadingIndicatorColor:  number;
    playingIcon:            Icon;
    iconLoadingColor:       number;
    activeScaleFactor:      number;
    buttonSize:             ButtonSize;
    rippleTarget:           RippleTarget;
    accessibilityPlayData:  AccessibilityPauseDataClass;
    accessibilityPauseData: AccessibilityPauseDataClass;
}

export enum ButtonSize {
    MusicPlayButtonSizeSmall = "MUSIC_PLAY_BUTTON_SIZE_SMALL",
}

export enum RippleTarget {
    MusicPlayButtonRippleTargetSelf = "MUSIC_PLAY_BUTTON_RIPPLE_TARGET_SELF",
}

export enum ContentPosition {
    MusicItemThumbnailOverlayContentPositionCentered = "MUSIC_ITEM_THUMBNAIL_OVERLAY_CONTENT_POSITION_CENTERED",
}

export enum DisplayStyle {
    MusicItemThumbnailOverlayDisplayStylePersistent = "MUSIC_ITEM_THUMBNAIL_OVERLAY_DISPLAY_STYLE_PERSISTENT",
}

export interface PlaylistItemData {
    playlistSetVideoId: string;
    videoId:            string;
}

export interface ShelfDivider {
    musicShelfDividerRenderer: MusicShelfDividerRenderer;
}

export interface MusicShelfDividerRenderer {
    hidden: boolean;
}

export interface Header {
    musicDetailHeaderRenderer: MusicDetailHeaderRenderer;
}

export interface MusicDetailHeaderRenderer {
    title:          Description;
    subtitle:       Subtitle;
    menu:           MusicDetailHeaderRendererMenu;
    thumbnail:      MusicDetailHeaderRendererThumbnail;
    trackingParams: string;
    description:    Description;
    moreButton:     MoreButton;
    subtitleBadges: Badge[];
    secondSubtitle: Description;
}

export interface MusicDetailHeaderRendererMenu {
    menuRenderer: FluffyMenuRenderer;
}

export interface FluffyMenuRenderer {
    items:           FluffyItem[];
    trackingParams:  string;
    topLevelButtons: FluffyTopLevelButton[];
    accessibility:   AccessibilityPauseDataClass;
}

export interface FluffyItem {
    menuNavigationItemRenderer?: MenuItemRenderer;
    menuServiceItemRenderer?:    MenuItemRenderer;
}

export interface FluffyTopLevelButton {
    buttonRenderer?:       ButtonRenderer;
    toggleButtonRenderer?: TopLevelButtonToggleButtonRenderer;
}

export interface ButtonRenderer {
    style:              string;
    size:               string;
    isDisabled:         boolean;
    text:               Description;
    icon:               Icon;
    navigationEndpoint: ButtonRendererNavigationEndpoint;
    accessibility:      AccessibilityAccessibilityData;
    trackingParams:     string;
    accessibilityData:  AccessibilityPauseDataClass;
}

export interface ButtonRendererNavigationEndpoint {
    clickTrackingParams:   string;
    watchPlaylistEndpoint: TargetClass;
}

export interface TargetClass {
    playlistId: string;
}

export interface TopLevelButtonToggleButtonRenderer {
    isToggled:              boolean;
    isDisabled:             boolean;
    defaultIcon:            Icon;
    defaultText:            DefaultTextClass;
    defaultServiceEndpoint: ToggleButtonRendererDefaultServiceEndpoint;
    toggledIcon:            Icon;
    toggledText:            DefaultTextClass;
    toggledServiceEndpoint: ToggleButtonRendererDefaultServiceEndpoint;
    trackingParams:         string;
}

export interface ToggleButtonRendererDefaultServiceEndpoint {
    clickTrackingParams: string;
    likeEndpoint:        DefaultServiceEndpointLikeEndpoint;
}

export interface DefaultServiceEndpointLikeEndpoint {
    status: Status;
    target: TargetClass;
}

export interface DefaultTextClass {
    runs:          DescriptionRun[];
    accessibility: AccessibilityPauseDataClass;
}

export interface MoreButton {
    toggleButtonRenderer: MoreButtonToggleButtonRenderer;
}

export interface MoreButtonToggleButtonRenderer {
    isToggled:      boolean;
    isDisabled:     boolean;
    defaultIcon:    Icon;
    defaultText:    Description;
    toggledIcon:    Icon;
    toggledText:    Description;
    trackingParams: string;
}

export interface Subtitle {
    runs: SubtitleRun[];
}

export interface SubtitleRun {
    text:                string;
    navigationEndpoint?: PurpleNavigationEndpoint;
}

export interface PurpleNavigationEndpoint {
    clickTrackingParams: string;
    browseEndpoint:      BrowseEndpoint;
}

export interface MusicDetailHeaderRendererThumbnail {
    croppedSquareThumbnailRenderer: CroppedSquareThumbnailRenderer;
}

export interface CroppedSquareThumbnailRenderer {
    thumbnail:      CroppedSquareThumbnailRendererThumbnail;
    trackingParams: string;
}

export interface CroppedSquareThumbnailRendererThumbnail {
    thumbnails: ThumbnailElement[];
}

export interface ThumbnailElement {
    url:    string;
    width:  number;
    height: number;
}

export interface Microformat {
    microformatDataRenderer: MicroformatDataRenderer;
}

export interface MicroformatDataRenderer {
    urlCanonical: string;
}

export interface ResponseContext {
    serviceTrackingParams: ServiceTrackingParam[];
}

export interface ServiceTrackingParam {
    service: string;
    params:  Param[];
}

export interface Param {
    key:   string;
    value: string;
}
