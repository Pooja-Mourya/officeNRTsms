let domain = "smspannel.newrise.in"
export default {
    entry_mode: 'mobile_app',


    base_url: `https://${domain}/api/`,
    base_url2: `https://${domain}/`,



    DatePickerModes: {
        date_mode: "date",
        time_mode: "time",
        date_time_mode: "datetime",
    },

    //regex patterns
    onlyNumberPattern: /[^0-9]/g,
    noSpacePattern: /^\s+|\s+$|\s+(?=\s)/g,

    asyncStorageKeys: {
        user_login: 'user_login',
        app_language_obj: "app_language_obj",
    },

    // ganeral
    avatarTextSize: 40,
    globalPaddingHorizontal: 16,
    globalPaddingVetical: 16,
    formFieldTopMargin: 15,
    globalPadding: 10,
    listItemBottomMargin: 15,
    maxLengthForMsg: 160,

    // maskView data 
    phone_number_format: '+91[000] [000] [000]',

    userImageMale: 'https://st3.depositphotos.com/15648834/17930/v/600/depositphotos_179308454-stock-illustration-unknown-person-silhouette-glasses-profile.jpg',
    userImageFemale: "https://cdn1.iconfinder.com/data/icons/avatars-1-5/136/87-512.png",


    // pop-up ui fields
    danger: "Danger",
    success: "Success",
    warning: "Warning",
    somethingWentWrong: "Something went wrong",

    isConnected: true,

    //  api body param 
    perPage: 10,

    // urls 
    apiEndPoints: {
        "forgotPassword": "forgot-password",
        serverInfo: 'server-info',
        importContact: 'contact-numbers-import',
        "send-sms": "send-sms",
        "contact_listing": "contact-groups", // 'phoneBook_listing': 'contact-groups' 
        "contact_add_group": 'contact-number',
        ContactGroup: "contact-group",
        // "contact_group/id": "contact-groups/id"
        'block_number_create': 'blacklists',
        'Add_block_number': 'blacklist',
        'upload_blacklist': 'blacklists-import',
        blackListAction: 'blacklist-action',
        sampleFIleBlacklist: 'black-list-sample-file',
        login: "login",
        "get-app-setting": "get-app-setting",
        // Dlt template 
        DltTemplateListing: "dlt-templates",
        users: "users",
        user: "user",
        // DltTemplateCreate: "dlt-template-create",       
        // DltTemplateCreate: "dlt-template",
        // DliTemplateDelete: "dlt-template",
        // DliTemplateUpdate: "dlt-template",
        resetPwd: 'reset-user-password',
        administrationChangeDltTemplatePriority: "administration/change-dlt-template-priority",
        // sender id        
        manageSenderId: "manage-sender-id",
        ManageSenderId: "manage-sender-ids",
        senderIdAction: "sender-id-action",
        assignSenderId: "assign-sender-id",
        manageSenderIds: "manage-sender-ids",
        userAction: 'user-action',
        //Report
        ReportList: "delivery-report",
        reportExportByMobile: 'report-export-by-mobile',
        msgConsumptionReport: 'msg-consumption-report',
        reportByMobile: "report-by-mobile",
        msgConsumption:"msg-consumption-report",
        // Invalid Number
        administrationInvalidSeriesList: "administration/invalid-series-list",
        administrationInvalidSeries: "administration/invalid-series",
        "update-self-password": "update-self-password",
        "update-profile": "update-profile",
        "app-setting-update": "app-setting-update",
        // DltTemplateCreate: "dlt-template-create",
        DltTemplate: "dlt-template",
        ImportDltTemplate: "dlt-templates-import",
        // DltTemplateCreate: "dlt-template",
        // DliTemplateDelete: "dlt-template",
        // DliTemplateUpdate: "dlt-template",       
        dltTemplatesAssignToUsers: "dlt-templates-assign-to-users",
        dltTemplatesImportAPI: "dlt-templates-import",
        logout: "logout",
        dltTemplatesImport: "dlt-templates-import",
        assignRoute: "administration/assign-route-to-user",
        creditRequestsList: "credit-requests",
        userCreditRequest: "credit-request",
        "contact_groups": "contact-groups",
        "users_for_ddl": "users-for-ddl",
        SecondaryRoutes: "administration/secondary-routes",
        "uploadDoc": "file-upload",
        "administration/app-setting-update": "administration/app-setting-update",
        "change-password": "change-password",
        "user-change-api-key": "user-change-api-key",
        "ip-white-list-for-apis": "ip-white-list-for-apis",
        "ip-white-list-for-api": "ip-white-list-for-api",
        "enable-additional-security": 'enable-additional-security',
        "ip-white-list-for-api": "ip-white-list-for-api", 
        "dashboard": "dashboard",
        getCampaignInfo: "get-campaign-info",
        campaignList: "campaign-list",
        sendSms: "send-sms",
        setRatio: 'administration/set-user-ratio',
        administrationManageCampaign: "administration/manage-campaign",
        ChangeCompaginStatusToComplete: 'administration/change-campaign-status-to-complete',
        ChangeCompaginStatusToStop: 'change-campaign-status-to-stop',
        repushCampaign: "repush-campaign",
        reportExportById: "report-export-by-id",
        changeCampaignStatusToStop: "change-campaign-status-to-stop",
        reportExportBySenderId: "report-export-by-sender-id",
        scheduledCampaignReport: "scheduled-campaign-report",

        //gateway 
        administrationPrimaryRoutes: "administration/primary-routes",
        AdministrationPrimaryRoute: "administration/primary-route",
        administrationCheckPrimaryRouteConnection: "administration/check-primary-route-connection",

        // credit info 
        userCredits: "user-credits",
        userCredit: "user-credit",
        userCreditRequestReply: "credit-request-reply",

        //upload document

        userDocuments: "user-documents",
        userDocument: "user-document",

        administrationNotificationTemplates: "administration/notification-templates",
        administrationNotificationTemplate: "administration/notification-template",

        // notifications 

        notifications: "notifications",
        notification: "notification",
        notificationRead: "notification-read",
        unreadNotificationCount: "unread-notification-count",
        userNotificationReadAll: "user-notification-read-all",
        userNotificationDelete: "user-notification-delete",

        //dlt-sample-file

        dltSampleFile: "dlt-sample-file",

        //user Operations 
        administrationInformingUserAboutServer: "administration/informing-user-about-server",
        overviewReportByUser: "overview-report-by-user",
        administrationGetUserRouteInfo: 'administration/get-user-route-info'


    },
    labels_for_non_react_files: {
        "something_went_wrong": "Something went wrong !!",

        "connect_internet_message": "Please check your internet connection !!",
        "alert_message": "Alert",
        "please_select_some_data_first": "Please select some data first",
        "session_expired": "Session expired, Please re-login",
        "location_permission_required": "Location permission required",

        "grant_location_permission": "Please grant the location permission to proceed furthur",
        // plane text or labels
        'email_is_required': 'Email is required',

        "grant_location_permission": "Please grant the location permission to proceed further",
        // camera request related messages
        "app_camera_permission": "App Camera Permission",
        "app_needs_access_to_your_camera": "App needs access to your camera",
        "app_image_permission": "App Phone's Storage Permission",
        "app_needs_access_to_your_image_library": "App needs access to your phone's storage",
        "ask_me_later": "Ask Me Later",
        "cancel": "Cancel",
        "ok": "OK",
        "select_photo": "Select Photo",
        "launch_camera": "Launch camera",
        "load_from_gallery": "Load from gallery",
        "something_went_wrong_upload": "Something went wrong while uploading file",
        "file_size_error_message": "File size should be less than or equal to 5 MB",
        "file_variable_size_error_message": "File size should be less than or equal to",
        "license_validity_restored_Log_in_again": "License validity restored log in again",
        "license_expired_renew_now": "License Expired, Renew Now",
        "max_limit_reached": "Max limit reached",
        "camera_permission_not_available": "Camera permission not available",
        "image_permission_not_available": "Phone's storage permission not available",

    },
    labels: {
        // messages and alert
        "message_alert": "Alert",
        "message_delete_confirmation": "Do you want to delete this ?",
        "message_delete_success": "Deleted Successfully",
        "message_add_success": 'Added Successfully',
        "message_update_success": 'Updated Successfully',
        "message_something_went_wrong": "Something went wrong !!",
        "message_url_can_not_open": "Can not open URL",
        "message_uploaded_successfully": "Uploaded Successfully !!",
        "message_no_file_uploaded": "No file uploaded yet !!",
        "message_removed_successfully": "Removed successfully",
        "message_fill_all_required_fields": "Please fill all required fields",
        "maximum_limit_reached": "Maximum limit reached",
        "message_login_first": "Please login first",
        "connect_internet_message": "Please check your internet connection !!",
        "please_select_some_data_first": "Please select some data first",
        "session_expired": "Session expired, Please re-login",
        "location_permission_required": "Location permission required",
        "grant_location_permission": "Please grant the location permission to proceed furthur",
        // plane text or labels
        'email_is_required': 'Email is required'
    },


}