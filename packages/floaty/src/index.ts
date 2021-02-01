importClass(java.lang.Runnable);
importClass(android.animation.ObjectAnimator)
importClass(android.animation.PropertyValuesHolder)
importClass(android.animation.ValueAnimator)
importClass(android.animation.Animator)
importClass(android.animation.AnimatorSet)
importClass(android.animation.AnimatorListenerAdapter)
importClass(android.view.animation.AccelerateInterpolator)
importClass(android.view.animation.TranslateAnimation)
importClass(android.animation.ObjectAnimator)
importClass(android.animation.TimeInterpolator)
importClass(android.os.Bundle)
importClass(android.view.View)
importClass(android.view.Window)

importClass(android.view.animation.AccelerateDecelerateInterpolator)
importClass(android.view.animation.AccelerateInterpolator)
importClass(android.view.animation.AnticipateInterpolator)
importClass(android.view.animation.AnticipateOvershootInterpolator)
importClass(android.view.animation.BounceInterpolator)
importClass(android.view.animation.CycleInterpolator)
importClass(android.view.animation.DecelerateInterpolator)
importClass(android.view.animation.LinearInterpolator)
importClass(android.view.animation.OvershootInterpolator)
importClass(android.view.animation.PathInterpolator)
importClass(android.widget.Button)
importClass(android.widget.ImageView)
importClass(android.widget.TextView)

import { fromUiEvent, getHeightPixels, getPrototype, getWidthPixels, isScreenLandscape } from "@auto.pro/core";
import { from, merge, Observable, Subject } from 'rxjs';
import { exhaustMap, filter, map, shareReplay, skipUntil, startWith, switchMap, takeUntil, tap, withLatestFrom, share, groupBy, take } from 'rxjs/operators';
import uuidjs from 'uuid-js';

const icons = [
    'ic_3d_rotation_black_48dp', 'ic_accessibility_black_48dp', 'ic_accessible_black_48dp', 'ic_account_balance_black_48dp', 'ic_account_balance_wallet_black_48dp', 'ic_account_box_black_48dp', 'ic_account_circle_black_48dp', 'ic_add_shopping_cart_black_48dp', 'ic_alarm_add_black_48dp', 'ic_alarm_black_48dp', 'ic_alarm_off_black_48dp', 'ic_alarm_on_black_48dp', 'ic_all_out_black_48dp', 'ic_android_black_48dp', 'ic_announcement_black_48dp', 'ic_aspect_ratio_black_48dp', 'ic_assessment_black_48dp', 'ic_assignment_black_48dp', 'ic_assignment_ind_black_48dp', 'ic_assignment_late_black_48dp', 'ic_assignment_returned_black_48dp', 'ic_assignment_return_black_48dp', 'ic_assignment_turned_in_black_48dp', 'ic_autorenew_black_48dp', 'ic_backup_black_48dp', 'ic_bookmark_black_48dp', 'ic_bookmark_border_black_48dp', 'ic_book_black_48dp', 'ic_bug_report_black_48dp', 'ic_build_black_48dp', 'ic_cached_black_48dp', 'ic_camera_enhance_black_48dp', 'ic_card_giftcard_black_48dp', 'ic_card_membership_black_48dp', 'ic_card_travel_black_48dp', 'ic_change_history_black_48dp', 'ic_check_circle_black_48dp', 'ic_chrome_reader_mode_black_48dp', 'ic_class_black_48dp', 'ic_code_black_48dp', 'ic_compare_arrows_black_48dp', 'ic_copyright_black_48dp', 'ic_credit_card_black_48dp', 'ic_dashboard_black_48dp', 'ic_date_range_black_48dp', 'ic_delete_black_48dp', 'ic_delete_forever_black_48dp', 'ic_description_black_48dp', 'ic_dns_black_48dp', 'ic_done_all_black_48dp', 'ic_done_black_48dp', 'ic_donut_large_black_48dp', 'ic_donut_small_black_48dp', 'ic_eject_black_48dp', 'ic_euro_symbol_black_48dp', 'ic_event_black_48dp', 'ic_event_seat_black_48dp', 'ic_exit_to_app_black_48dp', 'ic_explore_black_48dp', 'ic_extension_black_48dp', 'ic_face_black_48dp', 'ic_favorite_black_48dp', 'ic_favorite_border_black_48dp', 'ic_feedback_black_48dp', 'ic_find_in_page_black_48dp', 'ic_find_replace_black_48dp', 'ic_fingerprint_black_48dp', 'ic_flight_land_black_48dp', 'ic_flight_takeoff_black_48dp', 'ic_flip_to_back_black_48dp', 'ic_flip_to_front_black_48dp', 'ic_gavel_black_48dp', 'ic_get_app_black_48dp', 'ic_gif_black_48dp', 'ic_grade_black_48dp', 'ic_group_work_black_48dp', 'ic_g_translate_black_48dp', 'ic_help_black_48dp', 'ic_help_outline_black_48dp', 'ic_highlight_off_black_48dp', 'ic_history_black_48dp', 'ic_home_black_48dp', 'ic_hourglass_empty_black_48dp', 'ic_hourglass_full_black_48dp', 'ic_https_black_48dp', 'ic_http_black_48dp', 'ic_important_devices_black_48dp', 'ic_info_black_48dp', 'ic_info_outline_black_48dp', 'ic_input_black_48dp', 'ic_invert_colors_black_48dp', 'ic_label_black_48dp', 'ic_label_outline_black_48dp', 'ic_language_black_48dp', 'ic_launch_black_48dp', 'ic_lightbulb_outline_black_48dp', 'ic_line_style_black_48dp', 'ic_line_weight_black_48dp', 'ic_list_black_48dp', 'ic_lock_black_48dp', 'ic_lock_open_black_48dp', 'ic_lock_outline_black_48dp', 'ic_loyalty_black_48dp', 'ic_markunread_mailbox_black_48dp', 'ic_motorcycle_black_48dp', 'ic_note_add_black_48dp', 'ic_offline_pin_black_48dp', 'ic_opacity_black_48dp', 'ic_open_in_browser_black_48dp', 'ic_open_in_new_black_48dp', 'ic_open_with_black_48dp', 'ic_pageview_black_48dp', 'ic_pan_tool_black_48dp', 'ic_payment_black_48dp', 'ic_perm_camera_mic_black_48dp', 'ic_perm_contact_calendar_black_48dp', 'ic_perm_data_setting_black_48dp', 'ic_perm_device_information_black_48dp', 'ic_perm_identity_black_48dp', 'ic_perm_media_black_48dp', 'ic_perm_phone_msg_black_48dp', 'ic_perm_scan_wifi_black_48dp', 'ic_pets_black_48dp', 'ic_picture_in_picture_alt_black_48dp', 'ic_picture_in_picture_black_48dp', 'ic_play_for_work_black_48dp', 'ic_polymer_black_48dp', 'ic_power_settings_new_black_48dp', 'ic_pregnant_woman_black_48dp', 'ic_print_black_48dp', 'ic_query_builder_black_48dp', 'ic_question_answer_black_48dp', 'ic_receipt_black_48dp', 'ic_record_voice_over_black_48dp', 'ic_redeem_black_48dp', 'ic_remove_shopping_cart_black_48dp', 'ic_reorder_black_48dp', 'ic_report_problem_black_48dp', 'ic_restore_black_48dp', 'ic_restore_page_black_48dp', 'ic_room_black_48dp', 'ic_rounded_corner_black_48dp', 'ic_rowing_black_48dp', 'ic_schedule_black_48dp', 'ic_search_black_48dp', 'ic_settings_applications_black_48dp', 'ic_settings_backup_restore_black_48dp', 'ic_settings_black_48dp', 'ic_settings_bluetooth_black_48dp', 'ic_settings_brightness_black_48dp', 'ic_settings_cell_black_48dp', 'ic_settings_ethernet_black_48dp', 'ic_settings_input_antenna_black_48dp', 'ic_settings_input_component_black_48dp', 'ic_settings_input_composite_black_48dp', 'ic_settings_input_hdmi_black_48dp', 'ic_settings_input_svideo_black_48dp', 'ic_settings_overscan_black_48dp', 'ic_settings_phone_black_48dp', 'ic_settings_power_black_48dp', 'ic_settings_remote_black_48dp', 'ic_settings_voice_black_48dp', 'ic_shopping_basket_black_48dp', 'ic_shopping_cart_black_48dp', 'ic_shop_black_48dp', 'ic_shop_two_black_48dp', 'ic_speaker_notes_black_48dp', 'ic_speaker_notes_off_black_48dp', 'ic_spellcheck_black_48dp', 'ic_stars_black_48dp', 'ic_store_black_48dp', 'ic_subject_black_48dp', 'ic_supervisor_account_black_48dp', 'ic_swap_horiz_black_48dp', 'ic_swap_vertical_circle_black_48dp', 'ic_swap_vert_black_48dp', 'ic_system_update_alt_black_48dp', 'ic_tab_black_48dp', 'ic_tab_unselected_black_48dp', 'ic_theaters_black_48dp', 'ic_thumbs_up_down_black_48dp', 'ic_thumb_down_black_48dp', 'ic_thumb_up_black_48dp', 'ic_timeline_black_48dp', 'ic_toc_black_48dp', 'ic_today_black_48dp', 'ic_toll_black_48dp', 'ic_touch_app_black_48dp', 'ic_track_changes_black_48dp', 'ic_translate_black_48dp', 'ic_trending_down_black_48dp', 'ic_trending_flat_black_48dp', 'ic_trending_up_black_48dp', 'ic_turned_in_black_48dp', 'ic_turned_in_not_black_48dp', 'ic_update_black_48dp', 'ic_verified_user_black_48dp', 'ic_view_agenda_black_48dp', 'ic_view_array_black_48dp', 'ic_view_carousel_black_48dp', 'ic_view_column_black_48dp', 'ic_view_day_black_48dp', 'ic_view_headline_black_48dp', 'ic_view_list_black_48dp', 'ic_view_module_black_48dp', 'ic_view_quilt_black_48dp', 'ic_view_stream_black_48dp', 'ic_view_week_black_48dp', 'ic_visibility_black_48dp', 'ic_visibility_off_black_48dp', 'ic_watch_later_black_48dp', 'ic_work_black_48dp', 'ic_youtube_searched_for_black_48dp', 'ic_zoom_in_black_48dp', 'ic_zoom_out_black_48dp', 'ic_add_alert_black_48dp', 'ic_error_black_48dp', 'ic_error_outline_black_48dp', 'ic_warning_black_48dp', 'ic_add_to_queue_black_48dp', 'ic_airplay_black_48dp', 'ic_album_black_48dp', 'ic_art_track_black_48dp', 'ic_av_timer_black_48dp', 'ic_branding_watermark_black_48dp', 'ic_call_to_action_black_48dp', 'ic_closed_caption_black_48dp', 'ic_equalizer_black_48dp', 'ic_explicit_black_48dp', 'ic_fast_forward_black_48dp', 'ic_fast_rewind_black_48dp', 'ic_featured_play_list_black_48dp', 'ic_featured_video_black_48dp', 'ic_fiber_dvr_black_48dp', 'ic_fiber_manual_record_black_48dp', 'ic_fiber_new_black_48dp', 'ic_fiber_pin_black_48dp', 'ic_fiber_smart_record_black_48dp', 'ic_forward_10_black_48dp', 'ic_forward_30_black_48dp', 'ic_forward_5_black_48dp', 'ic_games_black_48dp', 'ic_hd_black_48dp', 'ic_hearing_black_48dp', 'ic_high_quality_black_48dp', 'ic_library_add_black_48dp', 'ic_library_books_black_48dp', 'ic_library_music_black_48dp', 'ic_loop_black_48dp', 'ic_mic_black_48dp', 'ic_mic_none_black_48dp', 'ic_mic_off_black_48dp', 'ic_movie_black_48dp', 'ic_music_video_black_48dp', 'ic_new_releases_black_48dp', 'ic_note_black_48dp', 'ic_not_interested_black_48dp', 'ic_pause_black_48dp', 'ic_pause_circle_filled_black_48dp', 'ic_pause_circle_outline_black_48dp', 'ic_playlist_add_black_48dp', 'ic_playlist_add_check_black_48dp', 'ic_playlist_play_black_48dp', 'ic_play_arrow_black_48dp', 'ic_play_circle_filled_black_48dp', 'ic_play_circle_filled_white_black_48dp', 'ic_play_circle_outline_black_48dp', 'ic_queue_black_48dp', 'ic_queue_music_black_48dp', 'ic_queue_play_next_black_48dp', 'ic_radio_black_48dp', 'ic_recent_actors_black_48dp', 'ic_remove_from_queue_black_48dp', 'ic_repeat_black_48dp', 'ic_repeat_one_black_48dp', 'ic_replay_10_black_48dp', 'ic_replay_30_black_48dp', 'ic_replay_5_black_48dp', 'ic_replay_black_48dp', 'ic_shuffle_black_48dp', 'ic_skip_next_black_48dp', 'ic_skip_previous_black_48dp', 'ic_slow_motion_video_black_48dp', 'ic_snooze_black_48dp', 'ic_sort_by_alpha_black_48dp', 'ic_stop_black_48dp', 'ic_subscriptions_black_48dp', 'ic_subtitles_black_48dp', 'ic_surround_sound_black_48dp', 'ic_videocam_black_48dp', 'ic_videocam_off_black_48dp', 'ic_video_call_black_48dp', 'ic_video_label_black_48dp', 'ic_video_library_black_48dp', 'ic_volume_down_black_48dp', 'ic_volume_mute_black_48dp', 'ic_volume_off_black_48dp', 'ic_volume_up_black_48dp', 'ic_web_asset_black_48dp', 'ic_web_black_48dp', 'ic_business_black_48dp', 'ic_call_black_48dp', 'ic_call_end_black_48dp', 'ic_call_made_black_48dp', 'ic_call_merge_black_48dp', 'ic_call_missed_black_48dp', 'ic_call_missed_outgoing_black_48dp', 'ic_call_received_black_48dp', 'ic_call_split_black_48dp', 'ic_chat_black_48dp', 'ic_chat_bubble_black_48dp', 'ic_chat_bubble_outline_black_48dp', 'ic_clear_all_black_48dp', 'ic_comment_black_48dp', 'ic_contacts_black_48dp', 'ic_contact_mail_black_48dp', 'ic_contact_phone_black_48dp', 'ic_dialer_sip_black_48dp', 'ic_dialpad_black_48dp', 'ic_email_black_48dp', 'ic_forum_black_48dp', 'ic_import_contacts_black_48dp', 'ic_import_export_black_48dp', 'ic_invert_colors_off_black_48dp', 'ic_live_help_black_48dp', 'ic_location_off_black_48dp', 'ic_location_on_black_48dp', 'ic_mail_outline_black_48dp', 'ic_message_black_48dp', 'ic_no_sim_black_48dp', 'ic_phonelink_erase_black_48dp', 'ic_phonelink_lock_black_48dp', 'ic_phonelink_ring_black_48dp', 'ic_phonelink_setup_black_48dp', 'ic_phone_black_48dp', 'ic_portable_wifi_off_black_48dp', 'ic_present_to_all_black_48dp', 'ic_ring_volume_black_48dp', 'ic_rss_feed_black_48dp', 'ic_screen_share_black_48dp', 'ic_speaker_phone_black_48dp', 'ic_stay_current_landscape_black_48dp', 'ic_stay_current_portrait_black_48dp', 'ic_stay_primary_landscape_black_48dp',
    'ic_stay_primary_portrait_black_48dp', 'ic_stop_screen_share_black_48dp', 'ic_swap_calls_black_48dp', 'ic_textsms_black_48dp', 'ic_voicemail_black_48dp', 'ic_vpn_key_black_48dp', 'ic_add_black_48dp', 'ic_add_box_black_48dp', 'ic_add_circle_black_48dp', 'ic_add_circle_outline_black_48dp', 'ic_archive_black_48dp', 'ic_backspace_black_48dp', 'ic_block_black_48dp', 'ic_clear_black_48dp', 'ic_content_copy_black_48dp', 'ic_content_cut_black_48dp', 'ic_content_paste_black_48dp', 'ic_create_black_48dp', 'ic_delete_sweep_black_48dp', 'ic_drafts_black_48dp', 'ic_filter_list_black_48dp', 'ic_flag_black_48dp', 'ic_font_download_black_48dp', 'ic_forward_black_48dp', 'ic_gesture_black_48dp', 'ic_inbox_black_48dp', 'ic_link_black_48dp', 'ic_low_priority_black_48dp', 'ic_mail_black_48dp', 'ic_markunread_black_48dp', 'ic_move_to_inbox_black_48dp', 'ic_next_week_black_48dp', 'ic_redo_black_48dp', 'ic_remove_black_48dp', 'ic_remove_circle_black_48dp', 'ic_remove_circle_outline_black_48dp', 'ic_reply_all_black_48dp', 'ic_reply_black_48dp', 'ic_report_black_48dp', 'ic_save_black_48dp', 'ic_select_all_black_48dp', 'ic_send_black_48dp', 'ic_sort_black_48dp', 'ic_text_format_black_48dp', 'ic_unarchive_black_48dp', 'ic_undo_black_48dp', 'ic_weekend_black_48dp', 'ic_access_alarms_black_48dp', 'ic_access_alarm_black_48dp', 'ic_access_time_black_48dp', 'ic_add_alarm_black_48dp', 'ic_airplanemode_active_black_48dp', 'ic_airplanemode_inactive_black_48dp', 'ic_battery_20_black_48dp', 'ic_battery_30_black_48dp', 'ic_battery_50_black_48dp', 'ic_battery_60_black_48dp', 'ic_battery_80_black_48dp', 'ic_battery_90_black_48dp', 'ic_battery_alert_black_48dp', 'ic_battery_charging_20_black_48dp', 'ic_battery_charging_30_black_48dp', 'ic_battery_charging_50_black_48dp', 'ic_battery_charging_60_black_48dp', 'ic_battery_charging_80_black_48dp', 'ic_battery_charging_90_black_48dp', 'ic_battery_charging_full_black_48dp', 'ic_battery_full_black_48dp', 'ic_battery_std_black_48dp', 'ic_battery_unknown_black_48dp', 'ic_bluetooth_black_48dp', 'ic_bluetooth_connected_black_48dp', 'ic_bluetooth_disabled_black_48dp', 'ic_bluetooth_searching_black_48dp', 'ic_brightness_auto_black_48dp', 'ic_brightness_high_black_48dp', 'ic_brightness_low_black_48dp', 'ic_brightness_medium_black_48dp', 'ic_data_usage_black_48dp', 'ic_developer_mode_black_48dp', 'ic_devices_black_48dp', 'ic_dvr_black_48dp', 'ic_gps_fixed_black_48dp', 'ic_gps_not_fixed_black_48dp', 'ic_gps_off_black_48dp', 'ic_graphic_eq_black_48dp', 'ic_location_disabled_black_48dp', 'ic_location_searching_black_48dp', 'ic_network_cell_black_48dp', 'ic_network_wifi_black_48dp', 'ic_nfc_black_48dp', 'ic_screen_lock_landscape_black_48dp', 'ic_screen_lock_portrait_black_48dp', 'ic_screen_lock_rotation_black_48dp', 'ic_screen_rotation_black_48dp', 'ic_sd_storage_black_48dp', 'ic_settings_system_daydream_black_48dp', 'ic_signal_cellular_0_bar_black_48dp', 'ic_signal_cellular_1_bar_black_48dp', 'ic_signal_cellular_2_bar_black_48dp', 'ic_signal_cellular_3_bar_black_48dp', 'ic_signal_cellular_4_bar_black_48dp', 'ic_signal_cellular_connected_no_internet_0_bar_black_48dp', 'ic_signal_cellular_connected_no_internet_1_bar_black_48dp', 'ic_signal_cellular_connected_no_internet_2_bar_black_48dp', 'ic_signal_cellular_connected_no_internet_3_bar_black_48dp', 'ic_signal_cellular_connected_no_internet_4_bar_black_48dp', 'ic_signal_cellular_no_sim_black_48dp', 'ic_signal_cellular_null_black_48dp', 'ic_signal_cellular_off_black_48dp', 'ic_signal_wifi_0_bar_black_48dp', 'ic_signal_wifi_1_bar_black_48dp', 'ic_signal_wifi_1_bar_lock_black_48dp', 'ic_signal_wifi_2_bar_black_48dp', 'ic_signal_wifi_2_bar_lock_black_48dp', 'ic_signal_wifi_3_bar_black_48dp', 'ic_signal_wifi_3_bar_lock_black_48dp', 'ic_signal_wifi_4_bar_black_48dp', 'ic_signal_wifi_4_bar_lock_black_48dp', 'ic_signal_wifi_off_black_48dp', 'ic_storage_black_48dp', 'ic_usb_black_48dp', 'ic_wallpaper_black_48dp', 'ic_widgets_black_48dp', 'ic_wifi_lock_black_48dp', 'ic_wifi_tethering_black_48dp', 'ic_attach_file_black_48dp', 'ic_attach_money_black_48dp', 'ic_border_all_black_48dp', 'ic_border_bottom_black_48dp', 'ic_border_clear_black_48dp', 'ic_border_color_black_48dp', 'ic_border_horizontal_black_48dp', 'ic_border_inner_black_48dp', 'ic_border_left_black_48dp', 'ic_border_outer_black_48dp', 'ic_border_right_black_48dp', 'ic_border_style_black_48dp', 'ic_border_top_black_48dp', 'ic_border_vertical_black_48dp', 'ic_bubble_chart_black_48dp', 'ic_drag_handle_black_48dp', 'ic_format_align_center_black_48dp', 'ic_format_align_justify_black_48dp', 'ic_format_align_left_black_48dp', 'ic_format_align_right_black_48dp', 'ic_format_bold_black_48dp', 'ic_format_clear_black_48dp', 'ic_format_color_fill_black_48dp', 'ic_format_color_reset_black_48dp', 'ic_format_color_text_black_48dp', 'ic_format_indent_decrease_black_48dp', 'ic_format_indent_increase_black_48dp', 'ic_format_italic_black_48dp', 'ic_format_line_spacing_black_48dp', 'ic_format_list_bulleted_black_48dp', 'ic_format_list_numbered_black_48dp', 'ic_format_paint_black_48dp', 'ic_format_quote_black_48dp', 'ic_format_shapes_black_48dp', 'ic_format_size_black_48dp', 'ic_format_strikethrough_black_48dp', 'ic_format_textdirection_l_to_r_black_48dp', 'ic_format_textdirection_r_to_l_black_48dp', 'ic_format_underlined_black_48dp', 'ic_functions_black_48dp', 'ic_highlight_black_48dp', 'ic_insert_chart_black_48dp', 'ic_insert_comment_black_48dp', 'ic_insert_drive_file_black_48dp', 'ic_insert_emoticon_black_48dp', 'ic_insert_invitation_black_48dp', 'ic_insert_link_black_48dp', 'ic_insert_photo_black_48dp', 'ic_linear_scale_black_48dp', 'ic_merge_type_black_48dp', 'ic_mode_comment_black_48dp', 'ic_mode_edit_black_48dp', 'ic_monetization_on_black_48dp', 'ic_money_off_black_48dp', 'ic_multiline_chart_black_48dp', 'ic_pie_chart_black_48dp', 'ic_pie_chart_outlined_black_48dp', 'ic_publish_black_48dp', 'ic_short_text_black_48dp', 'ic_show_chart_black_48dp', 'ic_space_bar_black_48dp', 'ic_strikethrough_s_black_48dp', 'ic_text_fields_black_48dp', 'ic_title_black_48dp', 'ic_vertical_align_bottom_black_48dp', 'ic_vertical_align_center_black_48dp', 'ic_vertical_align_top_black_48dp', 'ic_wrap_text_black_48dp', 'ic_attachment_black_48dp', 'ic_cloud_black_48dp', 'ic_cloud_circle_black_48dp', 'ic_cloud_done_black_48dp', 'ic_cloud_download_black_48dp', 'ic_cloud_off_black_48dp', 'ic_cloud_queue_black_48dp', 'ic_cloud_upload_black_48dp', 'ic_create_new_folder_black_48dp', 'ic_file_download_black_48dp', 'ic_file_upload_black_48dp', 'ic_folder_black_48dp', 'ic_folder_open_black_48dp', 'ic_folder_shared_black_48dp', 'ic_cast_black_48dp', 'ic_cast_connected_black_48dp', 'ic_computer_black_48dp', 'ic_desktop_mac_black_48dp', 'ic_desktop_windows_black_48dp', 'ic_developer_board_black_48dp', 'ic_devices_other_black_48dp', 'ic_device_hub_black_48dp', 'ic_dock_black_48dp', 'ic_gamepad_black_48dp', 'ic_headset_black_48dp', 'ic_headset_mic_black_48dp', 'ic_keyboard_arrow_down_black_48dp', 'ic_keyboard_arrow_left_black_48dp', 'ic_keyboard_arrow_right_black_48dp', 'ic_keyboard_arrow_up_black_48dp', 'ic_keyboard_backspace_black_48dp', 'ic_keyboard_black_48dp', 'ic_keyboard_capslock_black_48dp', 'ic_keyboard_hide_black_48dp', 'ic_keyboard_return_black_48dp', 'ic_keyboard_tab_black_48dp', 'ic_keyboard_voice_black_48dp', 'ic_laptop_black_48dp', 'ic_laptop_chromebook_black_48dp', 'ic_laptop_mac_black_48dp', 'ic_laptop_windows_black_48dp', 'ic_memory_black_48dp', 'ic_mouse_black_48dp', 'ic_phonelink_black_48dp', 'ic_phonelink_off_black_48dp', 'ic_phone_android_black_48dp', 'ic_phone_iphone_black_48dp', 'ic_power_input_black_48dp', 'ic_router_black_48dp', 'ic_scanner_black_48dp', 'ic_security_black_48dp', 'ic_sim_card_black_48dp', 'ic_smartphone_black_48dp', 'ic_speaker_black_48dp', 'ic_speaker_group_black_48dp', 'ic_tablet_android_black_48dp', 'ic_tablet_black_48dp', 'ic_tablet_mac_black_48dp', 'ic_toys_black_48dp', 'ic_tv_black_48dp', 'ic_videogame_asset_black_48dp', 'ic_watch_black_48dp', 'ic_add_a_photo_black_48dp', 'ic_add_to_photos_black_48dp', 'ic_adjust_black_48dp', 'ic_assistant_black_48dp', 'ic_assistant_photo_black_48dp', 'ic_audiotrack_black_48dp', 'ic_blur_circular_black_48dp', 'ic_blur_linear_black_48dp', 'ic_blur_off_black_48dp', 'ic_blur_on_black_48dp', 'ic_brightness_1_black_48dp', 'ic_brightness_2_black_48dp', 'ic_brightness_3_black_48dp', 'ic_brightness_4_black_48dp', 'ic_brightness_5_black_48dp', 'ic_brightness_6_black_48dp', 'ic_brightness_7_black_48dp', 'ic_broken_image_black_48dp', 'ic_brush_black_48dp', 'ic_burst_mode_black_48dp', 'ic_camera_alt_black_48dp', 'ic_camera_black_48dp', 'ic_camera_front_black_48dp', 'ic_camera_rear_black_48dp', 'ic_camera_roll_black_48dp', 'ic_center_focus_strong_black_48dp', 'ic_center_focus_weak_black_48dp', 'ic_collections_black_48dp', 'ic_collections_bookmark_black_48dp', 'ic_colorize_black_48dp', 'ic_color_lens_black_48dp', 'ic_compare_black_48dp', 'ic_control_point_black_48dp', 'ic_control_point_duplicate_black_48dp', 'ic_crop_16_9_black_48dp', 'ic_crop_3_2_black_48dp', 'ic_crop_5_4_black_48dp', 'ic_crop_7_5_black_48dp', 'ic_crop_black_48dp', 'ic_crop_din_black_48dp', 'ic_crop_free_black_48dp', 'ic_crop_landscape_black_48dp', 'ic_crop_original_black_48dp', 'ic_crop_portrait_black_48dp', 'ic_crop_rotate_black_48dp', 'ic_crop_square_black_48dp', 'ic_dehaze_black_48dp', 'ic_details_black_48dp', 'ic_edit_black_48dp', 'ic_exposure_black_48dp', 'ic_exposure_neg_1_black_48dp', 'ic_exposure_neg_2_black_48dp', 'ic_exposure_plus_1_black_48dp', 'ic_exposure_plus_2_black_48dp', 'ic_exposure_zero_black_48dp', 'ic_filter_1_black_48dp', 'ic_filter_2_black_48dp', 'ic_filter_3_black_48dp', 'ic_filter_4_black_48dp', 'ic_filter_5_black_48dp', 'ic_filter_6_black_48dp', 'ic_filter_7_black_48dp', 'ic_filter_8_black_48dp', 'ic_filter_9_black_48dp', 'ic_filter_9_plus_black_48dp', 'ic_filter_black_48dp', 'ic_filter_b_and_w_black_48dp', 'ic_filter_center_focus_black_48dp', 'ic_filter_drama_black_48dp', 'ic_filter_frames_black_48dp',
    'ic_filter_hdr_black_48dp', 'ic_filter_none_black_48dp', 'ic_filter_tilt_shift_black_48dp', 'ic_filter_vintage_black_48dp', 'ic_flare_black_48dp', 'ic_flash_auto_black_48dp', 'ic_flash_off_black_48dp', 'ic_flash_on_black_48dp', 'ic_flip_black_48dp', 'ic_gradient_black_48dp', 'ic_grain_black_48dp', 'ic_grid_off_black_48dp', 'ic_grid_on_black_48dp', 'ic_hdr_off_black_48dp', 'ic_hdr_on_black_48dp', 'ic_hdr_strong_black_48dp', 'ic_hdr_weak_black_48dp', 'ic_healing_black_48dp', 'ic_image_aspect_ratio_black_48dp', 'ic_image_black_48dp', 'ic_iso_black_48dp', 'ic_landscape_black_48dp', 'ic_leak_add_black_48dp', 'ic_leak_remove_black_48dp', 'ic_lens_black_48dp', 'ic_linked_camera_black_48dp', 'ic_looks_3_black_48dp', 'ic_looks_4_black_48dp', 'ic_looks_5_black_48dp', 'ic_looks_6_black_48dp', 'ic_looks_black_48dp', 'ic_looks_one_black_48dp', 'ic_looks_two_black_48dp', 'ic_loupe_black_48dp', 'ic_monochrome_photos_black_48dp', 'ic_movie_creation_black_48dp', 'ic_movie_filter_black_48dp', 'ic_music_note_black_48dp', 'ic_nature_black_48dp', 'ic_nature_people_black_48dp', 'ic_navigate_before_black_48dp', 'ic_navigate_next_black_48dp', 'ic_palette_black_48dp', 'ic_panorama_black_48dp', 'ic_panorama_fish_eye_black_48dp', 'ic_panorama_horizontal_black_48dp', 'ic_panorama_vertical_black_48dp', 'ic_panorama_wide_angle_black_48dp', 'ic_photo_album_black_48dp', 'ic_photo_black_48dp', 'ic_photo_camera_black_48dp', 'ic_photo_filter_black_48dp', 'ic_photo_library_black_48dp', 'ic_photo_size_select_actual_black_48dp', 'ic_photo_size_select_large_black_48dp', 'ic_photo_size_select_small_black_48dp', 'ic_picture_as_pdf_black_48dp', 'ic_portrait_black_48dp', 'ic_remove_red_eye_black_48dp', 'ic_rotate_90_degrees_ccw_black_48dp', 'ic_rotate_left_black_48dp', 'ic_rotate_right_black_48dp', 'ic_slideshow_black_48dp', 'ic_straighten_black_48dp', 'ic_style_black_48dp', 'ic_switch_camera_black_48dp', 'ic_switch_video_black_48dp', 'ic_tag_faces_black_48dp', 'ic_texture_black_48dp', 'ic_timelapse_black_48dp', 'ic_timer_10_black_48dp', 'ic_timer_3_black_48dp', 'ic_timer_black_48dp', 'ic_timer_off_black_48dp', 'ic_tonality_black_48dp', 'ic_transform_black_48dp', 'ic_tune_black_48dp', 'ic_view_comfy_black_48dp', 'ic_view_compact_black_48dp', 'ic_vignette_black_48dp', 'ic_wb_auto_black_48dp', 'ic_wb_cloudy_black_48dp', 'ic_wb_incandescent_black_48dp', 'ic_wb_iridescent_black_48dp', 'ic_wb_sunny_black_48dp', 'ic_add_location_black_48dp', 'ic_beenhere_black_48dp', 'ic_directions_bike_black_48dp', 'ic_directions_black_48dp', 'ic_directions_boat_black_48dp', 'ic_directions_bus_black_48dp', 'ic_directions_car_black_48dp', 'ic_directions_railway_black_48dp', 'ic_directions_run_black_48dp', 'ic_directions_subway_black_48dp', 'ic_directions_transit_black_48dp', 'ic_directions_walk_black_48dp', 'ic_edit_location_black_48dp', 'ic_ev_station_black_48dp', 'ic_flight_black_48dp', 'ic_hotel_black_48dp', 'ic_layers_black_48dp', 'ic_layers_clear_black_48dp', 'ic_local_activity_black_48dp', 'ic_local_airport_black_48dp', 'ic_local_atm_black_48dp', 'ic_local_bar_black_48dp', 'ic_local_cafe_black_48dp', 'ic_local_car_wash_black_48dp', 'ic_local_convenience_store_black_48dp', 'ic_local_dining_black_48dp', 'ic_local_drink_black_48dp', 'ic_local_florist_black_48dp', 'ic_local_gas_station_black_48dp', 'ic_local_grocery_store_black_48dp', 'ic_local_hospital_black_48dp', 'ic_local_hotel_black_48dp', 'ic_local_laundry_service_black_48dp', 'ic_local_library_black_48dp', 'ic_local_mall_black_48dp', 'ic_local_movies_black_48dp', 'ic_local_offer_black_48dp', 'ic_local_parking_black_48dp', 'ic_local_pharmacy_black_48dp', 'ic_local_phone_black_48dp', 'ic_local_pizza_black_48dp', 'ic_local_play_black_48dp', 'ic_local_post_office_black_48dp', 'ic_local_printshop_black_48dp', 'ic_local_see_black_48dp', 'ic_local_shipping_black_48dp', 'ic_local_taxi_black_48dp', 'ic_map_black_48dp', 'ic_my_location_black_48dp', 'ic_navigation_black_48dp', 'ic_near_me_black_48dp', 'ic_person_pin_black_48dp', 'ic_person_pin_circle_black_48dp', 'ic_pin_drop_black_48dp', 'ic_place_black_48dp', 'ic_rate_review_black_48dp', 'ic_restaurant_black_48dp', 'ic_restaurant_menu_black_48dp', 'ic_satellite_black_48dp', 'ic_store_mall_directory_black_48dp', 'ic_streetview_black_48dp', 'ic_subway_black_48dp', 'ic_terrain_black_48dp', 'ic_traffic_black_48dp', 'ic_train_black_48dp', 'ic_tram_black_48dp', 'ic_transfer_within_a_station_black_48dp', 'ic_zoom_out_map_black_48dp', 'ic_apps_black_48dp', 'ic_arrow_back_black_48dp', 'ic_arrow_downward_black_48dp', 'ic_arrow_drop_down_black_48dp', 'ic_arrow_drop_down_circle_black_48dp', 'ic_arrow_drop_up_black_48dp', 'ic_arrow_forward_black_48dp', 'ic_arrow_upward_black_48dp', 'ic_cancel_black_48dp', 'ic_check_black_48dp', 'ic_chevron_left_black_48dp', 'ic_chevron_right_black_48dp', 'ic_close_black_48dp', 'ic_expand_less_black_48dp', 'ic_expand_more_black_48dp', 'ic_first_page_black_48dp', 'ic_fullscreen_black_48dp', 'ic_fullscreen_exit_black_48dp', 'ic_last_page_black_48dp', 'ic_menu_black_48dp', 'ic_more_horiz_black_48dp', 'ic_more_vert_black_48dp', 'ic_refresh_black_48dp', 'ic_subdirectory_arrow_left_black_48dp', 'ic_subdirectory_arrow_right_black_48dp', 'ic_unfold_less_black_48dp', 'ic_unfold_more_black_48dp', 'ic_adb_black_48dp', 'ic_airline_seat_flat_angled_black_48dp', 'ic_airline_seat_flat_black_48dp', 'ic_airline_seat_individual_suite_black_48dp', 'ic_airline_seat_legroom_extra_black_48dp', 'ic_airline_seat_legroom_normal_black_48dp', 'ic_airline_seat_legroom_reduced_black_48dp', 'ic_airline_seat_recline_extra_black_48dp', 'ic_airline_seat_recline_normal_black_48dp', 'ic_bluetooth_audio_black_48dp', 'ic_confirmation_number_black_48dp', 'ic_disc_full_black_48dp', 'ic_do_not_disturb_alt_black_48dp', 'ic_do_not_disturb_black_48dp', 'ic_do_not_disturb_off_black_48dp', 'ic_do_not_disturb_on_black_48dp', 'ic_drive_eta_black_48dp', 'ic_enhanced_encryption_black_48dp', 'ic_event_available_black_48dp', 'ic_event_busy_black_48dp', 'ic_event_note_black_48dp', 'ic_folder_special_black_48dp', 'ic_live_tv_black_48dp', 'ic_mms_black_48dp', 'ic_more_black_48dp', 'ic_network_check_black_48dp', 'ic_network_locked_black_48dp', 'ic_no_encryption_black_48dp', 'ic_ondemand_video_black_48dp', 'ic_personal_video_black_48dp', 'ic_phone_bluetooth_speaker_black_48dp', 'ic_phone_forwarded_black_48dp', 'ic_phone_in_talk_black_48dp', 'ic_phone_locked_black_48dp', 'ic_phone_missed_black_48dp', 'ic_phone_paused_black_48dp', 'ic_power_black_48dp', 'ic_priority_high_black_48dp', 'ic_rv_hookup_black_48dp', 'ic_sd_card_black_48dp', 'ic_sim_card_alert_black_48dp', 'ic_sms_black_48dp', 'ic_sms_failed_black_48dp', 'ic_sync_black_48dp', 'ic_sync_disabled_black_48dp', 'ic_sync_problem_black_48dp', 'ic_system_update_black_48dp', 'ic_tap_and_play_black_48dp', 'ic_time_to_leave_black_48dp', 'ic_vibration_black_48dp', 'ic_voice_chat_black_48dp', 'ic_vpn_lock_black_48dp', 'ic_wc_black_48dp', 'ic_wifi_black_48dp', 'ic_ac_unit_black_48dp', 'ic_airport_shuttle_black_48dp', 'ic_all_inclusive_black_48dp', 'ic_beach_access_black_48dp', 'ic_business_center_black_48dp', 'ic_casino_black_48dp', 'ic_child_care_black_48dp', 'ic_child_friendly_black_48dp', 'ic_fitness_center_black_48dp', 'ic_free_breakfast_black_48dp', 'ic_golf_course_black_48dp', 'ic_hot_tub_black_48dp', 'ic_kitchen_black_48dp', 'ic_pool_black_48dp', 'ic_room_service_black_48dp', 'ic_smoke_free_black_48dp', 'ic_smoking_rooms_black_48dp', 'ic_spa_black_48dp', 'ic_cake_black_48dp', 'ic_domain_black_48dp', 'ic_group_add_black_48dp', 'ic_group_black_48dp', 'ic_location_city_black_48dp', 'ic_mood_bad_black_48dp', 'ic_mood_black_48dp', 'ic_notifications_active_black_48dp', 'ic_notifications_black_48dp', 'ic_notifications_none_black_48dp', 'ic_notifications_off_black_48dp', 'ic_notifications_paused_black_48dp', 'ic_pages_black_48dp', 'ic_party_mode_black_48dp', 'ic_people_black_48dp', 'ic_people_outline_black_48dp', 'ic_person_add_black_48dp', 'ic_person_black_48dp', 'ic_person_outline_black_48dp', 'ic_plus_one_black_48dp', 'ic_poll_black_48dp', 'ic_public_black_48dp', 'ic_school_black_48dp', 'ic_sentiment_dissatisfied_black_48dp', 'ic_sentiment_neutral_black_48dp', 'ic_sentiment_satisfied_black_48dp', 'ic_sentiment_very_dissatisfied_black_48dp', 'ic_sentiment_very_satisfied_black_48dp', 'ic_share_black_48dp', 'ic_whatshot_black_48dp', 'ic_star_black_48dp', 'ic_star_border_black_48dp', 'ic_star_half_black_48dp'
] as const


/**
 * 创建一个悬浮窗
 * @param {Object} option
 * @param {string} option.logo - logo图片地址
 * @param {number} option.logoSize 按钮尺寸
 * @param {number} option.duration 悬浮窗开关的过渡时间
 * @param {number} option.radius 子菜单距离logo的长度（包含子菜单的直径），默认120
 * @param {number} option.angle 子菜单形成的最大角度，默认120，建议大于90小于180
 * @param {number} option.initX 初始X坐标，默认为-2
 * @param {number} option.initY 初始Y坐标，默认为高度的一半
 * @param {number} option.edge 吸附边缘时的x位移，默认为-2
 * @param {Object[]} option.items 子菜单数组
 */
export function createFloaty({
    logo = 'https://pro.autojs.org/images/logo.png',
    logoSize = 44,
    duration = 200,
    radius = 120,
    angle = 120,
    items = [
        {
            id: 'id_0',
            color: '#047BC3',
            icon: 'ic_play_arrow_black_48dp',
            callback() { }
        },
        {
            id: 'id_1',
            color: '#08BC92',
            icon: ['ic_pause_circle_outline_black_48dp', 'ic_play_circle_outline_black_48dp'],
            callback(state) {
                toastLog(state)
            }
        },
        {
            id: 'id_2',
            color: '#DC1C2C',
            icon: 'ic_clear_black_48dp',
            callback() { }
        },
    ],
    initX = -2,
    initY = getHeightPixels() / 2,
    edge = -2,
    moveLimit = 50
}: {
    logo?: string | string[]
    logoSize?: number
    /**
     * 动画过渡总时间，默认200(ms)
     */
    duration?: number
    /**
     * 子菜单离logo的距离，算上了子菜单本身的长度
     */
    radius?: number
    /**
     * 子菜单形成的角度，默认120(度)
     */
    angle?: number
    /**
     * 子菜单列表
     * @param {string} id id不能重复
     * @param {string|string[]} icon 安卓系统内置图标，可为字符串或字符串数组，当为数组时每次点击都会切换到下个图标，callback的state也会切换  
     * @param {string|string[]} color 十六机制颜色，如'#ffffff'，可为字符串或字符串数组，仅当数组长度与icon长度相同时会进行切换  
     * @param {(state) => any} callback 点击后的回调函数，state对应当前icon的索引，当icon为字符串时始终为0  
     * @param {boolean} toggleOnClick 点击时是否自动关闭悬浮窗，默认为true
     */
    items?: {
        id: string
        icon: typeof icons[number] | (typeof icons[number])[]
        color: string | string[]
        tint?: string
        toggleOnClick?: boolean
        callback: Function
    }[],
    initX?: number
    initY?: number
    edge?: number
    moveLimit?: number
} = {}): {
    FLOATY: FloatyRawWindow
    items: { toggleIcon: (iconIndex?: number) => number }[]
    isOpen$: Observable<boolean>
    close: Function
} {
    const size = Math.floor(logoSize)
    const ICON_SIZE = Math.floor(32 / 44 * size)

    // size实际像素
    const DPI = context.getResources().getDisplayMetrics().density
    const SIZE_PIXELS = Math.floor(size * DPI)

    const FLOATY = floaty.rawWindow(`
        <frame w="${2 * radius}" h="${2 * radius}">
            ${items.map(item => {
        return `
                <frame id="${item.id}" w="${size}" h="${size}" alpha="0" layout_gravity="center">
                    <img w="${size}" h="${size}" id="${item.id}_color" src="${getPrototype(item.color) === 'String' ? item.color : item.color && item.color && item.color.length > 0 && item.color[0]}" circle="true" />
                    <img w="${ICON_SIZE}" h="${ICON_SIZE}" id="${item.id}_icon" src="@drawable/${getPrototype(item.icon) === 'String' ? item.icon : item.icon && item.icon.length > 0 && item.icon[0]}" tint="${item.tint || '#ffffff'}" gravity="center" layout_gravity="center" />
                </frame>
                    `
    }).join('')
        }
            <frame id="logo" w="${size}" h="${size}" alpha="0.4" layout_gravity="center">
                <img id="img_logo" w="*" h="*" src="${logo}" gravity="center" layout_gravity="center" />
            </frame>
        </frame>
    `)

    // 创建一个替身，让子菜单在关闭时不接受点击事件
    const STAND = floaty.rawWindow(`
        <frame id="btn" w="${size}" h="${size}" alpha="0">
            <img id="stand_logo" w="*" h="*" src="${logo}" gravity="center" layout_gravity="center" />
        </frame>
    `)

    // 两个悬浮窗的偏移量，在计算位置时 FLOATY的坐标 = STAND的坐标 - 偏移量
    const FLOATY_STAND_OFFSET_X = FLOATY.logo.getX()
    const FLOATY_STAND_OFFSET_Y = FLOATY.logo.getY()

    // 设置悬浮窗的初始位置
    FLOATY.setTouchable(false)
    FLOATY.setPosition(initX - FLOATY_STAND_OFFSET_X, initY - FLOATY_STAND_OFFSET_Y)
    STAND.setPosition(initX, initY)

    // 悬浮窗的开关状态及动画
    const toggleFloaty$ = new Subject<boolean>()
    const isFloatyOpen$: Observable<boolean> = toggleFloaty$.asObservable().pipe(
        exhaustMap(() => {
            return from(animation())
        }),
        startWith(false),
        shareReplay(1)
    )
    isFloatyOpen$.subscribe(isOpen => FLOATY.setTouchable(isOpen))


    function toggleFloaty() {
        ui.run(() => {
            toggleFloaty$.next(true)
        })
    }

    // 动画
    function animation() {
        return new Promise<boolean>((resolve, reject) => {

            const logo = FLOATY['logo']
            const firstElement = items && items.length > 0 && FLOATY[items[0].id]

            if (!firstElement) {
                return resolve(true)
            }

            const isOpen = firstElement.getX() === logo.getX()
            const direction = STAND.getX() < getWidthPixels() / 2 ? 1 : -1

            const base = Math.floor(angle / (items.length - 1))
            const r = Math.floor(radius * DPI - (SIZE_PIXELS / 2 + 2))
            const animationItems: any[] = []
            let α = angle / 2
            items.forEach(item => {
                const element = FLOATY[item.id]

                // 偏移的x = cos α * r, y = -1 * sin α * r
                const offsetX = Math.floor(r * Math.cos(Math.PI * α / 180)) * direction
                const offsetY = Math.floor(r * Math.sin(Math.PI * α / 180)) * -1

                if (isOpen) {
                    animationItems.push(
                        ObjectAnimator.ofFloat(element, "translationX", 0, offsetX),
                        ObjectAnimator.ofFloat(element, "translationY", 0, offsetY),
                        ObjectAnimator.ofFloat(element, "scaleX", 0, 1),
                        ObjectAnimator.ofFloat(element, "scaleY", 0, 1),
                        ObjectAnimator.ofFloat(element, "alpha", 0, 1),
                    )
                } else {
                    animationItems.push(
                        ObjectAnimator.ofFloat(element, "translationX", offsetX, 0),
                        ObjectAnimator.ofFloat(element, "translationY", offsetY, 0),
                        ObjectAnimator.ofFloat(element, "scaleX", 1, 0),
                        ObjectAnimator.ofFloat(element, "scaleY", 1, 0),
                        ObjectAnimator.ofFloat(element, "alpha", 1, 0),
                    )
                }
                α -= base
            })
            const set = new AnimatorSet()
            set.playTogether(...animationItems)
            set.setDuration(duration)

            // logo变亮的按钮效果在前
            if (isOpen) {
                logo.attr('alpha', 1)
            }
            set.start()
            set.addListener(new JavaAdapter(Animator.AnimatorListener, {
                onAnimationEnd() {
                    if (!isOpen) {
                        logo.attr('alpha', 0.4)
                    }
                    resolve(isOpen)
                }
            }))
        })
    }

    // 派发触摸事件
    const down$ = new Subject<any>()
    const up$ = new Subject<any>()
    const moveSource = new Subject<any>()

    down$.pipe(
        map(e => ({ dx: e.getRawX(), dy: e.getRawY(), sx: STAND.getX(), sy: STAND.getY() })),
        switchMap(({ dx, dy, sx, sy }) => {

            // 悬浮窗仅当关闭时可以移动
            // move$有个moveLimit的启动距离限制
            const move$ = moveSource.pipe(
                withLatestFrom(isFloatyOpen$),
                filter(([e, isOpen]) => !isOpen && (e.getRawX() - dx >= moveLimit || e.getRawY() - dy >= moveLimit)),
                take(1),
                switchMap(() => moveSource),
                share()
            )
            return merge(
                // 按下后无移动，则弹起时视为点击
                up$.pipe(
                    takeUntil(move$),
                    tap(() => {
                        toggleFloaty()
                    })
                ),
                move$.pipe(
                    tap(e_move => {
                        FLOATY.setPosition(sx + e_move.getRawX() - dx - FLOATY_STAND_OFFSET_X, sy + e_move.getRawY() - dy - FLOATY_STAND_OFFSET_Y)
                    }),
                    takeUntil(up$),
                ),
                // 按下后有移动，则弹起时视为移动结束
                up$.pipe(
                    skipUntil(move$),
                    tap((e_up) => {
                        const upX = e_up.getRawX();
                        const nowFY = FLOATY.getY()
                        const widthPixels = getWidthPixels();
                        // 吸附左右边界
                        if (upX < 100) {
                            FLOATY.setPosition(edge - FLOATY_STAND_OFFSET_X, nowFY)
                            STAND.setPosition(edge, nowFY + FLOATY_STAND_OFFSET_Y);
                        }
                        else if (upX > widthPixels - 100) {
                            FLOATY.setPosition(widthPixels - FLOATY_STAND_OFFSET_X - SIZE_PIXELS - edge, nowFY)
                            STAND.setPosition(widthPixels - SIZE_PIXELS - edge, nowFY + FLOATY_STAND_OFFSET_Y);
                        } else {
                            STAND.setPosition(FLOATY.getX() + FLOATY_STAND_OFFSET_X, FLOATY.getY() + FLOATY_STAND_OFFSET_Y);
                        }
                    })
                )
            )
        })
    ).subscribe()

    STAND.btn.setOnTouchListener((v, e) => {
        switch (e.getAction()) {
            case e.ACTION_DOWN:
                down$.next(e)
                break
            case e.ACTION_MOVE:
                moveSource.next(e)
                break
            case e.ACTION_UP:
                up$.next(e)
                break
        }
        return true
    })
    let screenLandscape = isScreenLandscape();
    const t = setInterval(() => {
        // 屏幕旋转监听
        if (screenLandscape !== isScreenLandscape()) {
            screenLandscape = isScreenLandscape();
            let widthPixels = getWidthPixels();
            let heightPixels = getHeightPixels();
            let attachLeft = edge - FLOATY_STAND_OFFSET_X === FLOATY.getX();
            let attachRight = heightPixels - FLOATY_STAND_OFFSET_X - SIZE_PIXELS - edge === FLOATY.getX(); // 现在的height为原来的width
            let nowX = FLOATY.getX() / heightPixels * widthPixels;
            let nowY = FLOATY.getY() / widthPixels * heightPixels;
            // 吸附左右边界
            if (attachLeft) {
                FLOATY.setPosition(edge - FLOATY_STAND_OFFSET_X, nowY)
                STAND.setPosition(edge, nowY + FLOATY_STAND_OFFSET_Y);
            }
            else if (attachRight) {
                FLOATY.setPosition(widthPixels - FLOATY_STAND_OFFSET_X - SIZE_PIXELS - edge, nowY)
                STAND.setPosition(widthPixels - SIZE_PIXELS - edge, nowY + FLOATY_STAND_OFFSET_Y);
            } else {
                FLOATY.setPosition(nowX, nowY);
                STAND.setPosition(nowX + FLOATY_STAND_OFFSET_X, nowY + FLOATY_STAND_OFFSET_Y);
            }
        }
    }, 1000)

    const list = items.map(item => {
        let index = 0
        const iconLength = getPrototype(item.icon) === 'Array' && item.icon.length || 0
        const colorLength = getPrototype(item.color) === 'Array' && item.color.length || 0

        function toggleIcon(iconIndex?) {
            if (iconLength > 1) {
                if (iconIndex === undefined) {
                    index = (index + 1) % iconLength
                } else {
                    index = iconIndex % iconLength
                }
                ui.run(() => {
                    FLOATY[item.id + '_icon'].setSource(`@drawable/${item.icon[index]}`)
                    if (iconLength === colorLength) {
                        FLOATY[item.id + '_color'].setSource(item.color[index])
                    }

                })
            }
            return index
        }

        // toggleFloaty通过主线程通信实现，toggleIcon通过ui.run实现
        fromUiEvent(FLOATY[item.id], 'click').subscribe(() => {
            if (item.toggleOnClick !== false) {
                toggleFloaty()
            }
            item.callback && item.callback(index)
            toggleIcon()
        })

        return {
            toggleIcon
        }
    })

    return {
        FLOATY,
        items: list,
        isOpen$: isFloatyOpen$,
        close() {
            FLOATY.close()
            STAND.close()
            clearInterval(t)
        }
    }
}