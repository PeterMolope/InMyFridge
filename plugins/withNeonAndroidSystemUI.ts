import { mergeContents } from '@expo/config-plugins/build/utils/generateCode';
import { ConfigPlugin, withAndroidStyles, withMainActivity } from 'expo/config-plugins';

// Android styles for edge-to-edge and system UI
const androidStyles = `
  <style name="AppTheme" parent="Theme.AppCompat.DayNight.NoActionBar">
    <item name="android:windowDrawsSystemBarBackgrounds">true</item>
    <item name="android:statusBarColor">@android:color/transparent</item>
    <item name="android:navigationBarColor">#000000</item>
    <item name="android:windowLightStatusBar">false</item>
    <item name="android:windowLightNavigationBar">true</item>
    <item name="android:windowTranslucentStatus">true</item>
    <item name="android:windowTranslucentNavigation">false</item>
    <item name="android:colorPrimary">#39FF14</item>
    <item name="android:colorPrimaryDark">#32CC10</item>
    <item name="android:colorAccent">#39FF14</item>
  </style>
`;

// MainActivity modification for edge-to-edge
const mainActivityModification = `
  import android.os.Bundle;
  import android.view.View;
  import android.view.WindowInsets;
  import androidx.core.view.WindowCompat;
  import androidx.core.view.WindowInsetsController;

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    // Enable edge-to-edge display
    WindowCompat.setDecorFitsSystemWindows(getWindow(), false);
    
    // Configure system UI behavior
    WindowInsetsController controller = new WindowInsetsController(getWindow(), getWindow().getDecorView());
    controller.hide(WindowInsets.Type.statusBars() | WindowInsets.Type.navigationBars());
    controller.setSystemBarsBehavior(WindowInsetsController.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE);
    
    // Set light navigation bar icons for dark theme
    getWindow().getDecorView().setSystemUiVisibility(
      View.SYSTEM_UI_FLAG_LAYOUT_STABLE |
      View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN |
      View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION |
      View.SYSTEM_UI_FLAG_LIGHT_NAVIGATION_BAR
    );
  }
`;

/**
 * Expo Config Plugin for Android System UI configuration
 * Implements edge-to-edge display and neon theme system bars
 */
export const withAndroidSystemUI: ConfigPlugin = (config) => {
  return withAndroidStyles(config, (config) => {
    config.modResults = addAndroidStyles(config.modResults);
    return config;
  });
};

/**
 * Expo Config Plugin for MainActivity modification
 * Adds edge-to-edge configuration to MainActivity
 */
export const withMainActivitySystemUI: ConfigPlugin = (config) => {
  return withMainActivity(config, (config) => {
    config.modResults.contents = addMainActivityModification(config.modResults.contents);
    return config;
  });
};

/**
 * Adds Android styles for neon theme and edge-to-edge
 */
function addAndroidStyles(styleString: string): string {
  const pattern = /<\/resources>/;
  const addition = androidStyles + '\n</resources>';
  
  return mergeContents({
    tag: 'android-styles',
    src: styleString,
    newSrc: addition,
    anchor: pattern,
    offset: 0,
    comment: 'Add neon theme Android styles',
  }).contents;
}

/**
 * Adds MainActivity modifications for edge-to-edge display
 */
function addMainActivityModification(mainActivityString: string): string {
  // Find the onCreate method and insert our modifications
  const onCreatePattern = /(protected void onCreate\(Bundle savedInstanceState\)\s*\{[\s\S]*?super\.onCreate\(savedInstanceState\);)/;
  
  if (onCreatePattern.test(mainActivityString)) {
    return mainActivityString.replace(
      onCreatePattern,
      '$1' + mainActivityModification
    );
  }
  
  // If onCreate pattern not found, append before the last closing brace
  const lastBraceIndex = mainActivityString.lastIndexOf('}');
  if (lastBraceIndex !== -1) {
    return mainActivityString.slice(0, lastBraceIndex) + 
           mainActivityModification + 
           '\n' + 
           mainActivityString.slice(lastBraceIndex);
  }
  
  return mainActivityString;
}

/**
 * Combined plugin for all Android System UI configurations
 */
export const withNeonAndroidSystemUI: ConfigPlugin = (config) => {
  config = withAndroidSystemUI(config);
  config = withMainActivitySystemUI(config);
  return config;
};
