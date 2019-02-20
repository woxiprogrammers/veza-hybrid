// Ionic Starter App
//Creator: Shubham Chaudhari
var db = null;
angular.module('starter', ['ionic', 'ionic.cloud', 'starter.controllers', 'ngCordova', 'ionic-material', 'highcharts-ng', 'flexcalendar', 'eventcalendar', 'pascalprecht.translate', 'ionic-zoom-view'])
    .run(function ($rootScope, $ionicPlatform, $cordovaSQLite, $cordovaSplashscreen, $state, userSessions) {
        $ionicPlatform.ready(function () {
            $ionicPlatform.registerBackButtonAction(function (event) {
                if ($state.current.name == "app.dashboard" || $state.current.name == "login") {
                    window.plugins.appMinimize.minimize();
                }
                else {
                    navigator.app.backHistory();
                }
            }, 100);
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                cordova.plugins.Keyboard.disableScroll(true);
            }
            if (window.StatusBar) {
                // org.apache.cordova.statusbar required
                StatusBar.styleDefault();
            }

            db = window.openDatabase("test", "1.0", "Test DB", 1000000);
            $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS auth_details (id integer primary key, token text , userDataArray text, studentlist text, sessionUserRole text, sessionId text , sessionBodyId text, messageCount text)");
        });
    })
    .config(function ($stateProvider, $ionicCloudProvider, $urlRouterProvider, $ionicConfigProvider, $translateProvider) {
        // Turn off caching for demo simplicity's sake

        $ionicConfigProvider.views.maxCache(0);
        /*
        // Turn off back button text
        $ionicConfigProvider.backButton.previousTitleText(false);
        */
        $translateProvider.translations('en', {
            JANUARY: 'January',
            FEBRUARY: 'February',
            MARCH: 'March',
            APRIL: 'April',
            MAI: 'May',
            JUNE: 'June',
            JULY: 'July',
            AUGUST: 'August',
            SEPTEMBER: 'September',
            OCTOBER: 'October',
            NOVEMBER: 'November',
            DECEMBER: 'December',
            SUNDAY: 'Sunday',
            MONDAY: 'Monday',
            TUESDAY: 'Tuesday',
            WEDNESDAY: 'Wednesday',
            THURSDAY: 'Thurday',
            FRIDAY: 'Friday',
            SATURDAY: 'Saturday'
        });
        $translateProvider.preferredLanguage('en');
        $translateProvider.useSanitizeValueStrategy('escape');
        $stateProvider
            .state('login', {
                url: '/login',
                templateUrl: 'templates/login.html',
                controller: 'LoginCtrl'
            })

            .state('tokencheck', {
                url: '/tokencheck',
                templateUrl: 'templates/tokencheck.html',
                controller: 'tokencheckCtr'
            })

            .state('selectschool', {
                url: '/publicselectschool',
                templateUrl: 'templates/select-school.html',
                controller: 'SelectSchoolCtr'
            })

            .state('publicDashboard', {
                url: '/publicDashboard',
                templateUrl: 'templates/public-dashboard.html',
                controller: 'PublicDashboardCtr'
            })

            .state('publicEvents', {
                url: '/publicevents',
                templateUrl: 'templates/public-event.html',
                controller: 'PublicEventCtr'
            })

            .state('publicGallary', {
                url: '/publicGallary',
                templateUrl: 'templates/public-gallery.html',
                controller: 'PublicGallaryCtrl'
            })

            .state('publicGallaryLanding', {
                url: '/publicGallaryLanding',
                params:{
                    'obj':null
                },
                templateUrl: 'templates/public-gallery-landing.html',
                controller: 'PublicGallaryLandingCtrl'
            })

            .state('app', {
                url: '/app',
                templateUrl: 'templates/menu.html',
                abstract: true,
                controller: 'AppCtrl'
            })
            .state('app.gallery', {
                url: '/gallery',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/gallery.html',
                        controller: 'GalleryCtrl',
                    }, 'fabContent': {
                        template: ''
                    }
                }

            })
            .state('app.galleryLanding', {
                url: '/galleryLanding',
                params: {
                    'obj': null
                },
                views: {
                    'menuContent': {
                        templateUrl: 'templates/gallery-landing.html',
                        controller: 'GallaryLandingCtrl',
                    }, 'fabContent': {
                        template: ''
                    }
                }

            })

            .state('app.feeDetail', {
                url: '/feeDetail/:installment_id',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/fee-detail.html',
                        controller: 'FeeDetailCntrl'
                    },
                }
            })
            .state('app.feelanding', {
                url: '/feelanding',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/fee-landing-parent.html',
                        controller: 'FeeLandingParentCntrl'
                    },
                    'fabContent': {
                        template: ''
                    }
                }
            })
            .state('app.result', {
                url: '/result',
                params: {
                    obj: null
                },
                views: {
                    'menuContent': {
                        templateUrl: 'templates/result.html',
                        controller: 'ResultCntrl'
                    },
                    'fabContent': {
                        template: ''
                    }
                }
            })
            .state('app.resultSubjectDetail', {
                url: '/resultSubjectDetail/:obj',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/resultSubjectDetails.html',
                        controller: 'ResultSubjectDetailCntrl'
                    },
                    'fabContent': {
                        template: ''
                    }
                }
            })
            .state('app.dashboard', {
                url: '/dashboard',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/dashboard.html',
                        controller: 'DashboardCtrl'
                    }, 'fabContent': {
                        template: ''
                    }
                }
            })
            .state('app.notification', {
                url: '/notification',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/notification.html',
                        controller: 'NotificationCtrl'
                    }, 'fabContent': {
                        template: ''
                    }
                }
            })
            .state('app.sharedNotification', {
                url: '/sharedNotification',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/shared-notify.html',
                        controller: 'SharedNotificationCtrl'
                    },
                    'fabContent': {
                        template: '<button id="fab-new-event" ng-click="goToCreateAnnouncment()" class="button button-fab button-fab-bottom-right expanded fab-button-event  spin"><i class="icon ion-plus-circled"></i></button>',
                        controller: function ($timeout, $scope, $state) {
                            $scope.goToCreateAnnouncment = function () {
                                $state.go('app.createannouncement');
                            };
                            $timeout(function () {
                                document.getElementById('fab-new-event').classList.toggle('on');
                            }, 500);
                        }
                    }
                }
            })
            .state('app.createannouncement', {
                url: '/createannouncement',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/create-announcement.html',
                        controller: 'CreateAnnouncementCtrl'
                    },
                    'fabContent': {
                        controller: function ($timeout, $scope, $state) {
                            $timeout(function () {
                                document.getElementById('fab-new-event').classList.toggle('off');
                            }, 100);
                        }
                    }
                }
            })
            .state('app.sharedAchievement', {
                url: '/sharedAchievement',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/shared-achievement.html',
                        controller: 'SharedAchievementCtrl'
                    },
                    'fabContent': {
                        template: '<button id="fab-new-achievement" ng-click="goToCreateAchievement()" class="button button-fab button-fab-bottom-right expanded fab-button-event"><i class="icon ion-plus-circled"></i></button>',
                        controller: function (GLOBALS, $timeout, $scope, $state, userSessions, $http) {
                            $scope.goToCreateAchievement = function () {
                                var url = GLOBALS.baseUrl + "user/check-acl/" + userSessions.userSession.userId + "?token=" + userSessions.userSession.userToken;
                                $http.get(url).success(function (response) {
                                    console.log(response);
                                })
                                $state.go('app.createachievement');
                            }
                            $timeout(function () {
                                document.getElementById('fab-new-achievement').classList.toggle('on');
                            }, 900);
                        }
                    }
                }
            })
            .state('app.sharedAchievementParent', {
                url: '/sharedAchievementParent',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/shared-achievement-parent.html',
                        controller: 'sharedAchievementParentCtrl'
                    },
                    'fabContent': {
                        template: '',
                        controller: function ($timeout, $scope, $state) {

                            $timeout(function () {
                                document.getElementById('fab-new-achievement').classList.toggle('off');
                            }, 500);
                        }
                    }
                }
            })
           

            .state('app.achievementDetailParent', {
                url: '/sharedAchievementParent',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/achievement-parent.html',
                        controller: 'achievementDetailParentCtrl'
                    },
                    'fabContent': {
                        template: '',
                        controller: function ($timeout, $scope, $state) {

                            $timeout(function () {
                                document.getElementById('fab-new-achievement').classList.toggle('off');
                            }, 500);
                        }
                    }
                }
            })
            .state('app.sharedNotifyParent', {
                url: '/sharedNotifyParent',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/shared-notify-parent.html',
                        controller: 'sharedNotifyParentCtrl'
                    },
                    'fabContent': {
                        template: '',
                        controller: function ($timeout, $scope, $state) {
                            $scope.goToCreateAchievement = function () {
                                $state.go('app.createachievement');
                            }
                            $timeout(function () {
                                document.getElementById('fab-new-achievement').classList.toggle('off');
                            }, 500);
                        }
                    }
                }
            })
            .state('app.createachievement', {
                url: '/createachievement',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/create-achievement.html',
                        controller: 'CreateAchievementCtrl'
                    },
                    'fabContent': {
                        controller: function (GLOBALS, $timeout, $scope, $state, userSessions, $http) {

                        }
                    }
                }
            })
            .state('app.homework', {
                url: '/homework',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/homework-listing.html',
                        controller: 'HomeworkCtrl'
                    },
                    'fabContent': {
                        template: ''
                    }
                }
            })
            .state('app.parenthomework', {
                url: '/parenthomework',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/parent-hw-list.html',
                        controller: 'ParentHomeworkCtrl'
                    },
                    'fabContent': {
                        template: ''
                    }
                }
            })
            .state('app.hwcompose', {
                url: '/hwcompose',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/hwcompose.html',
                        controller: 'HwComposeCtrl'
                    },
                    'fabContent': {
                        template: ''
                    }
                }
            })
            .state('app.message', {
                url: '/message',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/message-listing.html',
                        controller: 'MessageCtrl'
                    },
                    'fabContent': {
                        template: '<button id="fab-new-message" ng-click="composeMsg()" class="button button-fab button-fab-bottom-right expanded fab-button-cool  spin"><i class="icon ion-edit"></i></button>',
                        controller: function ($timeout) {
                            $timeout(function () {
                                document.getElementById('fab-new-message').classList.toggle('on');
                            }, 900);
                        }
                    }
                }
            })
            .state('app.msgcompose', {
                url: '/msgcompose',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/msgcompose.html',
                        controller: 'MsgComposeCtrl'
                    },
                    'fabContent': {
                        template: ''
                    }
                }
            })
            .state('app.parentMsgcompose', {
                url: '/parentMsgcompose',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/parentmsgcompose.html',
                        controller: 'ParentMsgComposeCtrl'
                    },
                    'fabContent': {
                        template: ''
                    }
                }
            })
            .state('app.chatmsg', {
                url: '/chatmsg',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/message-chat.html',
                        controller: 'MsgChatCtrl'
                    },
                    'fabContent': {
                        template: ''
                    }
                }
            })
            .state('app.attendancelanding', {
                url: '/attendancelanding',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/attendance-landing.html',
                        controller: 'AttendLandingCtrl'
                    },
                    'fabContent': {
                        template: ''
                    }
                }
            })
            .state('app.markattendance', {
                url: '/markattendance',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/mark-attendance.html',
                        controller: 'MarkAttendanceCtrl'
                    },
                    'fabContent': {
                        template: ''
                    }
                }
            })
            .state('app.viewattendance', {
                url: '/viewattendance',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/view-attendance.html',
                        controller: 'ViewAttendanceCtrl'
                    },
                    'fabContent': {
                        template: ''
                    }
                }
            })
            .state('app.eventlandingteacher', {
                url: '/eventlandingteacher',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/event-landing-teacher.html',
                        controller: 'LandingEventTeacherCtrl'
                    },
                    'fabContent': {
                        template: '<button id="fab-new-event" ui-sref="app.createevent" class="button button-fab button-fab-bottom-right expanded fab-button-event  spin"><i class="icon ion-edit"></i></button>',
                        controller: function ($timeout) {
                            $timeout(function () {
                                document.getElementById('fab-new-event').classList.toggle('on');
                            }, 900);
                        }
                    }
                }
            })
            .state('app.eventlandingparent', {
                url: '/eventlandingparent',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/event-landing-parent.html',
                        controller: 'LandingEventParentCtrl'
                    },
                    'fabContent': {
                        template: ''
                    }
                }
            })
            .state('app.eventstatusteacher', {
                url: '/eventstatusteacher',
                params: {
                    obj: null
                },
                views: {
                    'menuContent': {
                        templateUrl: 'templates/event-status-teacher.html',
                        controller: 'EventStatusTeacherCtrl'
                    },
                    'fabContent': {
                        template: ''
                    }
                }

            })
            
            .state('app.editevent', {
                url: '/editevent',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/edit-event.html',
                        controller: 'EditEventCtrl'
                    },
                    'fabContent': {
                        template: ''
                    }
                }
            })
            .state('app.detaileventparent', {
                url: '/detaileventparent',
                params: {
                    obj: null
                },
                views: {
                    'menuContent': {
                        templateUrl: 'templates/detail-event-parent.html',
                        controller: 'DetailEventParentCtrl'
                    },
                    'fabContent': {
                        template: ''
                    }
                }
            })
            .state('app.createevent', {
                url: '/createevent',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/create-event.html',
                        controller: 'CreateEventCtrl'
                    },
                    'fabContent': {
                        template: ''
                    }
                }
            })
            .state('app.leavecreate', {
                url: '/leavecreate',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/create-leave.html',
                        controller: 'CreateLeaveCtrl'
                    },
                    'fabContent': {
                        template: ''
                    }
                }
            })
            .state('app.viewevents', {
                url: '/viewevents',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/view-event.html',
                        controller: 'ViewEventsCtrl'
                    },
                    'fabContent': {
                        template: ''
                    }
                }
            })
            .state('app.leaveapproval', {
                url: '/leaveapproval',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/leave-listing.html',
                        controller: 'ViewLeaveApprovalCtrl'
                    },
                    'fabContent': {
                        template: ''
                    }
                }
            })
            .state('app.approvedleaves', {
                url: '/approvedleaves',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/approved-leaves.html',
                        controller: 'ViewLeaveApprovedCtrl'
                    },
                    'fabContent': {
                        template: ''
                    }
                }
            })
            .state('app.detailspage', {
                url: '/detailspage',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/detail-description.html',
                        controller: 'DetailPageCtrl'
                    },
                    'fabContent': {
                        template: ''
                    }
                }
            })
            .state('app.achievementedit', {
                url: '/achievementedit',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/edit-achievement.html',
                        controller: 'EditAchievementCtrl'
                    }
                }
            })
            .state('app.achievementdetails', {
                url: '/achievementdetails',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/achievement-description.html',
                        controller: 'DetailPageCtrl'
                    },
                    'fabContent': {
                        template: ''
                    }
                }
            })
            
            .state('app.notificationdetails', {
                url: '/notificationdetails',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/notification-details.html',
                        controller: 'DetailPageCtrl'
                    },
                    'fabContent': {
                        template: ''
                    }
                }
            })
            .state('app.homeworkdetails', {
                url: '/homeworkdetails',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/homework-details.html',
                        controller: 'HWdetailCtrl'
                    },
                    'fabContent': {
                        template: ''
                    }
                }
            })
            .state('app.teacherhwdetail', {
                url: '/teacherhwdetail',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/teacher-hw-detail.html',
                        controller: 'THWdetailCtrl'
                    },
                    'fabContent': {
                        template: ''
                    }
                }
            })
            .state('app.leavedetails', {
                url: '/leavedetails',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/leave-details.html',
                        controller: 'LeaveDetailCtrl'
                    },
                    'fabContent': {
                        template: ''
                    }
                }
            })
            .state('app.approvedleavedetails', {
                url: '/approvedleavedetails',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/leave-approved-details.html',
                        controller: 'LeaveDetailCtrl'
                    },
                    'fabContent': {
                        template: ''
                    }
                }
            })
            .state('app.eventdetails', {
                url: '/eventdetails',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/event-description.html',
                        controller: 'DetailPageCtrl'
                    },
                    'fabContent': {
                        template: ''
                    }
                }
            })
            .state('app.homeworklanding', {
                url: '/homeworklanding',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/homework-landing.html',
                        controller: ''
                    },
                    'fabContent': {
                        template: '<button id="fab-new-homework" ng-click="composeHw()" class="button button-fab button-fab-bottom-right expanded bar-pink  spin"><i class="icon ion-edit"></i></button>',
                        controller: function ($timeout) {
                            $timeout(function () {
                                document.getElementById('fab-new-homework').classList.toggle('on');
                            }, 900);
                        }
                    }
                }
            })
            .state('app.eventedit', {
                url: '/eventedit',
                params: {
                    'obj': null
                },
                views: {
                    'menuContent': {
                        templateUrl: 'templates/event-edit.html',
                        controller: 'EditEventCtrl'
                    },
                    'fabContent': {
                        template: ''
                    }
                }
            })
            .state('app.edithomeworklisting', {
                url: '/edithomeworklisting',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/edit-homework.html',
                        controller: 'UnpubHwListCtrl'
                    },
                    'fabContent': {
                        template: '<button id="fab-new-homework" ng-click="composeHw()" class="button button-fab button-fab-bottom-right expanded bar-pink  spin"><i class="icon ion-edit"></i></button>',
                        controller: function ($timeout) {
                            $timeout(function () {
                                document.getElementById('fab-new-homework').classList.toggle('on');
                            }, 900);
                        }
                    }
                }
            })
            .state('app.homeworkedit', {
                url: '/homeworkedit',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/homework-edit.html',
                        controller: 'EditHomeworkCtrl'
                    },
                    'fabContent': {
                        template: ''
                    }
                }
            })
            .state('app.eventsLanding', {
                url: '/eventsLanding',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/events-landing.html',
                        controller: 'SharedAchievementCtrl'
                    },
                    'fabContent': {
                        template: ''
                    }
                }
            })
            .state('app.timetable', {
                url: '/timetable',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/time-table.html',
                        controller: 'TimeTableCtrl'
                    },
                    'fabContent': {
                        template: ''
                    }
                }
            })
            .state('app.parentattendancelanding', {
                url: '/parentattendancelanding',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/attendance-landing-parent.html',
                        controller: ''
                    },
                    'fabContent': {
                        template: '<button id="fab-leave-button" ng-click="createLeave()" class="button button-fab button-fab-bottom-right expanded bar-orange  spin"><i class="icon ion-edit"></i></button>',
                        controller: function ($timeout) {
                            $timeout(function () {
                                document.getElementById('fab-leave-button').classList.toggle('on');
                            }, 900);
                        }
                    }
                }
            })
            .state('app.resultview', {
                url: '/resultview',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/result-view.html',
                        controller: 'ResultViewCntrl'
                    },
                    'fabContent': {
                        template: ''
                    }
                }
            })
            .state('app.eventstatuspublic', {
                url: '/eventstatuspublic',
                params: {
                    obj: null
                },
                views: {
                    'menuContent': {
                        templateUrl: 'templates/public-event-status.html',
                        controller: 'EventStatusPublicCtrl'
                    }
                }
            })
            .state('app.achievementpublic', {
                url: '/sharedAchievementPublic',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/public-noticeboard.html',
                        controller: 'app.PublicNoticeboard'
                    }
                }
            })
            .state('app.achievementdetailspublic', {
                url: '/achievementdetailspublic',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/public-achievement-description.html',
                        controller: 'PublicAchievementDetail'
                    },
                    'fabContent': {
                        template: ''
                    }
                }
            });
        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('tokencheck');
    });
