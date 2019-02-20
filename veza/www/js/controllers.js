
/* global angular, document, window */
'use strict';
var db = null;
angular.module('starter.controllers', ['naif.base64', 'ionic.cloud', 'ionic-material', 'ngCordova'])
    .constant('GLOBALS', {
        // baseUrl:'http://sspss.veza.co.in/api/v1/',
        // baseUrlImage: 'http://sspss.veza.co.in/',
        versionCode: 1.9,
        baseUrl: 'http://sspss_test.woxi.co.in/api/v1/',
        baseUrlImage: 'http://sspss_test.woxi.co.in/'
    })

    .factory('Data', function () {
        return { message }
    })

    .service('myservice', function () {
        this.Switchstudentlist = "yyy";
    })

    .service('userSessions', function Usersession() {
        var userSessions = this;
        userSessions.userSession = [];
        userSessions.userSession.userToken = 0;
        userSessions.setSession = function (token, role, msgcount, bodyid) {
            userSessions.userSession.userToken = token;
            userSessions.userSession.userRole = role;
            userSessions.userSession.msgcount = msgcount;
            userSessions.userSession.bodyId = bodyid;
            return true;
        };
        userSessions.setUserId = function (id, bodyId) {
            userSessions.userSession.userId = id;
            userSessions.userSession.bodyId = bodyId;
            return true;
        };
        this.ss = function (id) {
            var retrievedData = localStorage.getItem("studentdata");
            var students = JSON.parse(retrievedData);
            var obj = students.filter(function (obj) {

                return obj.student_id === userSessions.userSession.userId;
            })[0];
            return obj;
        };
        userSessions.setMsgCount = function (count) {
            userSessions.userSession.msgcount = count;
            return true;
        };
        userSessions.setToken = function (id) {
            userSessions.userSession.userToken = id;
            return true;
        };
        userSessions.setMsgCount_0 = function () {
            userSessions.userSession.msgcount = '';
            return true;
        };
    })

    .service('userData', function uData() {
        var userData = this;
        userData.data = [];
        userData.setUserData = function (dataArray) {
            userData.data = dataArray;
            return true;
        };
        userData.getUserData = function () {
            return userData.data;
        };
    })

    .service('chatHist', function chatDetail() {
        var chatHist = this;
        chatHist.data = [];
        chatHist.setChatHist = function (userId, from, to, title, title_id) {
            chatHist.data.user_id = userId;
            chatHist.data.from_id = from;
            chatHist.data.to_id = to;
            chatHist.data.title = title;
            chatHist.data.title_id = title_id;
            return true;
        };
        chatHist.getChatHist = function () {
            return chatHist.data;
        };
    })

    .service('hwDetails', function hmwDetail() {
        var hwDetails = this;
        hwDetails.data = [];
        hwDetails.setHwView = function (data) {
            hwDetails.data = data;
            return true;
        };
        hwDetails.getHwView = function () {
            return hwDetails.data;
        };
    })

    .service('studentToggle', function studentToggle() {
        var studentToggle = this;
        studentToggle.data = [];
        studentToggle.setUserData = function (dataArray) {
            studentToggle.data = dataArray;
            return true;
        };
        studentToggle.getUserData = function () {
            return studentToggle.data;
        };
    })

    .controller('AppCtrl', function ($rootScope, userData, myservice, GLOBALS, $scope, $state, $ionicPopup, $http, $ionicModal, $ionicPopover, $timeout, $ionicSideMenuDelegate, $ionicHistory, userSessions) {
        $scope.$on("$ionicView.beforeEnter", function (event, data) {
            var url = GLOBALS.baseUrl + "user/get-message-count/" + userSessions.userSession.userId + "?token=" + userSessions.userSession.userToken;
            $http.get(url).success(function (response) {
                if (response['data']['Badge_count']['message_count'] > 0) {
                    userSessions.setMsgCount(response['data']['Badge_count']['message_count']);
                    $scope.msgCount = response['data']['Badge_count']['message_count'];
                } else {
                    $scope.msgCount = '';
                }
            })
                .error(function (response) {
                    console.log("Error in Response: " + response);
                });
            if (userSessions.userSession.msgcount > 0) {
                $scope.msgCount = userSessions.userSession.msgcount;
            }
            $scope.noticeBoard = function () {
                $state.go('app.sharedNotification');
            };
            $scope.studentlistForSwitch = function () {
                var url = GLOBALS.baseUrl + "user/get-switching-details?token=" + userSessions.userSession.userToken;
                $http.get(url).success(function (response) {
                    localStorage.setItem("studentdata", JSON.stringify(response['data']['Parent_student_relation']['Students']));
                    $scope.studentdataswitch = (response['data']['Parent_student_relation']['Students']);
                })
                    .error(function (response) {
                    });
            }
            $scope.studentlistForSwitch();
            $scope.checkLcStatus = function () {
                //check if LC is created
                var LcUrl = GLOBALS.baseUrl + "user/lc_generated/" + userSessions.userSession.userId + "?token=" + userSessions.userSession.userToken;
                $http.get(LcUrl).success(function (response) {
                    if (response.status == 200) {
                        $rootScope.lcStatus = response.is_lc_generated;
                    }
                })
            }
            $scope.checkLcStatus();
        });
        if (userSessions.userSession.userRole == 'teacher') {
            $scope.check = true;
            $scope.userData = userData.getUserData();
        } else {
            $scope.check = false;
        }
        $scope.showAlert = function () {
            var alertPopup = $ionicPopup.alert({
                title: 'Under construction!',
                template: 'To be released soon..! '
            });
        }
        $scope.studentlistForSwitch = function () {
            var url = GLOBALS.baseUrl + "user/get-switching-details?token=" + userSessions.userSession.userToken;
            $http.get(url).success(function (response) {
                localStorage.setItem("studentdata", JSON.stringify(response['data']['Parent_student_relation']['Students']));
                $scope.studentdataswitch = (response['data']['Parent_student_relation']['Students']);
            })
                .error(function (response) {
                    console.log("Error in Response: " + response);
                });
        }
        $scope.studentlistForSwitch();
        $scope.studentclick = function (student_id, bodyId) {
            $scope.gotodashboard();
            return userSessions.setUserId(student_id, bodyId);
        }
        $scope.gotodashboard = function () {
            $state.go('app.dashboard');
        }
        $scope.loginData = {};
        $scope.isExpanded = false;
        $scope.hasHeaderFabLeft = false;
        $scope.hasHeaderFabRight = false;
        $scope.aclMessage = "Access Denied";
        var navIcons = document.getElementsByClassName('ion-navicon');
        for (var i = 0; i < navIcons.length; i++) {
            navIcons.addEventListener('click', function () {
                current.classList.toggle('active');
            });
        }
        ////////////////////////////////////////
        // Layout Methods
        ////////////////////////////////////////
        $scope.hideNavBar = function () {
            document.getElementsByTagName('ion-nav-bar')[0].style.display = 'none';
        };
        $scope.showNavBar = function () {
            document.getElementsByTagName('ion-nav-bar')[0].style.display = 'block';
        };
        $scope.noHeader = function () {
            var content = document.getElementsByTagName('ion-content');
            for (var i = 0; i < content.length; i++) {
                if (content[i].classList.contains('has-header')) {
                    content[i].classList.toggle('has-header');
                }
            }
        };
        $scope.setExpanded = function (bool) {
            $scope.isExpanded = bool;
        };
        $scope.setHeaderFab = function (location) {
            var hasHeaderFabLeft = false;
            var hasHeaderFabRight = false;
            switch (location) {
                case 'left':
                    hasHeaderFabLeft = true;
                    break;
                case 'right':
                    hasHeaderFabRight = true;
                    break;
            }
            $scope.hasHeaderFabLeft = hasHeaderFabLeft;
            $scope.hasHeaderFabRight = hasHeaderFabRight;
        };
        $scope.hasHeader = function () {
            var content = document.getElementsByTagName('ion-content');
            for (var i = 0; i < content.length; i++) {
                if (!content[i].classList.contains('has-header')) {
                    content[i].classList.toggle('has-header');
                }
            }
        };
        $scope.hideHeader = function () {
            $scope.hideNavBar();
            $scope.noHeader();
        };
        $scope.showHeader = function () {
            $scope.showNavBar();
            $scope.hasHeader();
        };
        $scope.clearFabs = function () {
            var fabs = document.getElementsByClassName('button-fab');
            if (fabs.length && fabs.length > 1) {
                fabs[0].remove();
            }
        };
        $scope.signOut = function () {
            var url = GLOBALS.baseUrl + "user/logout/" + userSessions.userSession.userId + "?token=" + userSessions.userSession.userToken;
            $http.get(url).success(function (response) {
                userSessions.setToken(0);
                localStorage.setItem("appToken", JSON.stringify(0));
                $state.go('login');
                //  alert(response.message);
            }).error(function (response) {
                console.log("Error in Response: " + response);
                alert(response.message);
            });
        };
        $scope.studToggle = true;
        $scope.toggleStudent = function () {
            console.log("Changing Student");
            $scope.studToggle = $scope.studToggle === false ? true : false;
        };
        $scope.toggleLeftSideMenu = function () {
            if (userSessions.userSession.userRole == "parent") {
                $scope.studentlistForSwitch = function () {
                    var url = GLOBALS.baseUrl + "user/get-switching-details?token=" + userSessions.userSession.userToken;
                    $http.get(url).success(function (response) {
                        localStorage.setItem("studentdata", JSON.stringify(response['data']['Parent_student_relation']['Students']));
                        $scope.studentdataswitch = (response['data']['Parent_student_relation']['Students']);
                    })
                        .error(function (response) {
                            console.log("Error in Response: " + response);
                        });
                }
                $scope.studentlistForSwitch();
                $scope.obj = userSessions.ss();
                $ionicSideMenuDelegate.toggleLeft();
            }
            else {
                $ionicSideMenuDelegate.toggleLeft();
            }
        };
        $scope.myGoBack = function () {
            $ionicHistory.goBack();
        };
        $scope.dashBoard = function () {
            $state.go('app.dashboard');
        };
        $scope.composeHw = function () {
            $state.go('app.hwcompose');
        };
        $scope.createLeave = function () {
            $state.go('app.leavecreate');
        };
        $scope.composeMsg = function () {
            if (userSessions.userSession.userRole == "parent") {
                $state.go('app.parentMsgcompose');
            }
            else {
                $state.go('app.msgcompose');
            }
        };
        $scope.createAnnouncement = function () {
            $state.go('app.createannouncement');
        };
        $scope.createAchievement = function () {
            $state.go('app.createachievement');
        };
        $scope.announceDetails = function () {
            $state.go('app.announcedetails');
        };
        $scope.achievementDetail = function () {
            $state.go('app.achievementdetails');
        };
        $scope.notifyDetail = function () {
            $state.go('app.notificationdetails');
        };
        $scope.homeworkView = function () {
            if (userSessions.userSession.userRole == "parent") {
                $state.go('app.parenthomework');
            }
            else {
                $state.go('app.homeworklanding');
            }
        };
        $scope.attendanceLanding = function () {
            if (userSessions.userSession.userRole == "parent") {
                $state.go('app.parentattendancelanding');
            }
            else {
                $state.go('app.attendancelanding');
            }
        };
        $scope.homeworkDetails = function () {
            $state.go('app.homeworkdetails');
        };
        $scope.leaveDetails = function () {
            $state.go('app.leavedetails');
        };
        $scope.approveLeaveDetails = function () {
            $state.go('app.approvedleavedetails');
        };
        $scope.homeworkEdit = function () {
            $state.go('app.homeworkedit');
        };
        $scope.unPublishList = function () {
            $state.go('app.edithomeworklisting');
        };
        $scope.detailEvent = function () {
            $state.go('app.eventsLanding');
        };
        $scope.eventDetails = function () {
            $state.go('app.eventdetails');
        };
        $scope.eventEdit = function () {
            $state.go('app.eventedit');
        };
        $scope.resultView = function () {
            alert("To be released after exams.");
        };
        $scope.signIn = function () {
            $state.go('app.dashboard');
        };
        $scope.msgDetail = function () {
            $state.go('app.chatmsg');
        };
        $scope.viewMessagesList = function () {
            $state.go('app.message');
        };
    })

    .controller('tokencheckCtr', function ($rootScope, $window, $ionicPopup, userData, $http, GLOBALS, $state, $scope, $stateParams, userSessions, $timeout, ionicMaterialInk, ionicMaterialMotion) {
        var url = GLOBALS.baseUrl + "user/minimum-supported-version";
        $http.get(url).success(function(response){
            $scope.data = response.data;
            $rootScope.minimumAppVersion = $scope.data.minimum_app_version;
            if(GLOBALS.versionCode >= $scope.minimumAppVersion){
                $scope.versionCode
                $scope.tokenData = localStorage.getItem('appToken');
                $scope.sessionUserRole = localStorage.getItem('sessionUserRole');
                $scope.messageCount = localStorage.getItem('messageCount');
                $scope.sessionId = localStorage.getItem('sessionId');
                $scope.sessionBodyId = localStorage.getItem('sessionBodyId');
                $scope.userDataArray = localStorage.getItem('userDataArray');
                if ($scope.tokenData != null && $scope.tokenData != 0) {
                    userSessions.setToken(JSON.parse($scope.tokenData));
                    userData.setUserData(JSON.parse($scope.userDataArray));
                    userSessions.setSession(JSON.parse($scope.tokenData), JSON.parse($scope.sessionUserRole), JSON.parse($scope.messageCount));
                    userSessions.setUserId(JSON.parse($scope.sessionId), JSON.parse($scope.sessionBodyId));
                    var url = GLOBALS.baseUrl + "user/get-message-count/" + userSessions.userSession.userId + "?token=" + userSessions.userSession.userToken;
                    $http.get(url).success(function (response) {
                        if (response['data']['Badge_count']['message_count'] > 0) {
                            userSessions.setMsgCount(response['data']['Badge_count']['message_count']);
                            $scope.msgCount = response['data']['Badge_count']['message_count'];
                        } else {
                            $scope.msgCount = '';
                        }
                    })
                        .error(function (response) {
                            console.log("Error in Response: " + response);
                        });
                    $state.go('app.dashboard');
                }
                else {
                    $state.go('selectschool');
                }
            } else {
                $state.go('selectschool');
                $scope.showAlert();
            }
        }).error(function(response){
            console.log(response)
        })
        $scope.showAlert = function () {
            var alertPopup = $ionicPopup.alert({
                title: "You are on older version of the app",
                template: 'Please update the app'
            });
        }
    })

    .controller('GalleryCtrl', function ($ionicBackdrop, $ionicModal, $ionicSlideBoxDelegate, $ionicScrollDelegate, $ionicHistory, $rootScope, $ionicPush, myservice, $scope, $state, $ionicLoading, $http, $timeout, ionicMaterialInk, $cordovaSQLite, GLOBALS, $ionicPopup, userSessions, userData) {
        $scope.baseImageURL = GLOBALS.baseUrlImage
        var url = GLOBALS.baseUrl + "user/folder-first-image/" + userSessions.userSession.bodyId + "?token=" + userSessions.userSession.userToken;
        $http.get(url).success(function (response) {
            if (response.status == 200) {
                $scope.folders_size = response.data.folder_list.length;
                if ($scope.folders_size > 0) {
                    $scope.folders = response.data.folder_list;
                } else {
                    $scope.showAlertsucess("No data found")
                }
            } else {
                $scope.showAlertsucess("No data found")
            }

        }).error(function (err) {
        });
        $scope.showAlertsucess = function (message) {
            var alertPopup = $ionicPopup.alert({
                template: '<center>' + message + '<center>'
            })
        }
        $scope.myGoBack = function () {
            $state.go('app.dashboard')
        }
        $scope.galleryFolder = function (folderID) {
            $state.go('app.galleryLanding', { obj: folderID });
        }
    })

    .controller('GallaryLandingCtrl', function ($stateParams, $sce, $ionicPlatform, $ionicBackdrop, $ionicModal, $ionicSlideBoxDelegate, $ionicScrollDelegate, $ionicHistory, $rootScope, $ionicPush, myservice, $scope, $state, $ionicLoading, $http, $timeout, ionicMaterialInk, $cordovaSQLite, GLOBALS, $ionicPopup, userSessions, userData) {
        $scope.baseImageURL = GLOBALS.baseUrlImage
        $scope.folderID = $stateParams.obj;
        screen.orientation.unlock();
        $ionicScrollDelegate.scrollTop();
        $ionicLoading.show({
            template: 'Loading...',
            duration: 1500
        });
        var url = GLOBALS.baseUrl + "user/gallery-image/" + $scope.folderID + "?token=" + userSessions.userSession.userToken
        $http.get(url).success(function (response) {
            if (response['status'] == 200) {
                $scope.folderName = response.data[0].name;
                $scope.imagesLength = response.data[0].photos.length
                $scope.videoLength = response.data[0].videos.length
                if ($scope.imagesLength > 0) {
                    $scope.images = response.data[0].photos;
                }
                if ($scope.videoLength > 0) {
                    $scope.video = response.data[0].videos
                }
                if ($scope.imagesLength == 0 && $scope.videoLength == 0) {
                    $timeout(function () {
                        $scope.showAlertsucess('No Data Uploaded yet')
                    }, 1500);
                }
            } else {
                $scope.showAlertsucess('No Data found')
            }
        })
        $scope.showAlertsucess = function (message) {
            var alertPopup = $ionicPopup.alert({
                template: '<center>' + message + '<center>'
            })
        }
        $ionicLoading.show({
            template: 'Loading...',
            duration: 1500
        })
        $scope.myGoBack = function () {
            $state.go('app.gallery')
        }
        $scope.showImages = function (index) {
            $scope.activeSlide = index;
            $scope.showModal('templates/image-popover.html');
        };
        $scope.showModal = function (templateUrl) {
            $ionicModal.fromTemplateUrl(templateUrl, {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function (modal) {
                $scope.modal = modal;
                $scope.modal.show();
            });
        }
        // Close the modal
        $scope.closeModal = function () {
            $scope.modal.remove();
            $scope.modal.hide();

        };
        $ionicPlatform.onHardwareBackButton(function () {
            $scope.modal.remove();
            $scope.modal.hide();

        });
        $scope.trustSrc = function (src) {
            return $sce.trustAsResourceUrl($scope.baseImageURL + src);
        };
        $scope.playVideo = function () {
            $ionicScrollDelegate.scrollTop();
            $scope.showModal('templates/video-popover.html');
        }
        $scope.zoomMin = 1;
    })


    .controller('LoginCtrl', function ($ionicHistory, $rootScope, $ionicPush, myservice, $scope, $state, $ionicLoading, $http, $timeout, ionicMaterialInk, $cordovaSQLite, GLOBALS, $ionicPopup, userSessions, userData) {
        $scope.goBackToSelectSchool = function () {
            $state.go('selectschool')
        };
        $scope.data = [];
        ionicMaterialInk.displayEffect();
        
        $scope.submit = function (email, password) {
            if(GLOBALS.versionCode >= $scope.minimumAppVersion){
                $scope.sessionId = '';
            $scope.sessionToken = '';
            $scope.sessionUserRole = '';
            var url = GLOBALS.baseUrl + "user/auth";
            $http.post(url, { email: email, password: password }).success(function (res) {
                $scope.Switchstudentlist = (res['data']['Students']);
                $scope.data.message = res['message'];

                // FCM Token is generated here
                $scope.register = function () {
                    window.FirebasePlugin.getToken(function (token) {
                        // save this server-side and use it to push notifications to this device
                        $rootScope.pushToken = token;
                        $scope.saveToken();
                    }, function (error) {
                        console.error(error);
                    });
                }

                $scope.saveToken = function () {
                    var url = GLOBALS.baseUrl + "user/save-push?token=" + res['data']['users']['token'];
                    $http.post(url, { pushToken: $rootScope.pushToken, user_id: res['data']['Badge_count']['user_id'] }).success(function (response) {
                    }).error(function (err) {
                        console.log(err)
                    });
                }
                if (res['status'] == 200) {
                    $scope.register();
                    $scope.studentlist = (res.data['users']);
                    localStorage.setItem('appToken', JSON.stringify($scope.studentlist['token']));
                    $scope.userDataArray = userData.setUserData(res['data']['users']);
                    localStorage.setItem('userDataArray', JSON.stringify(res['data']['users']));
                    $scope.sessionToken = res['data']['users']['token'];
                    $scope.sessionUserRole = res['data']['users']['role_type'];
                    localStorage.setItem('sessionUserRole', JSON.stringify($scope.sessionUserRole));
                    $scope.sessionId = res['data']['Badge_count']['user_id'];
                    localStorage.setItem('sessionId', JSON.stringify($scope.sessionId));
                    $scope.sessionBodyId = res['data']['Badge_count']['body_id'];
                    localStorage.setItem('sessionBodyId', JSON.stringify($scope.sessionBodyId));
                    $scope.messageCount = res['data']['Badge_count']['message_count'];
                    var userSet = false;
                    var idSet = false;
                    userSet = userSessions.setSession($scope.sessionToken, $scope.sessionUserRole, $scope.messageCount);
                    idSet = userSessions.setUserId($scope.sessionId, $scope.sessionBodyId);
                    if (userSet == true && idSet == true) {
                        $state.go('app.dashboard');
                    }
                }
            })
                .error(function (err) {
                    console.log(err);
                    $scope.error = err['message'];
                });
            } else {
                $scope.showUpdateAppAlert()
            }
           
        }

        $scope.showUpdateAppAlert = function () {
            var alertPopup = $ionicPopup.alert({
                title: "You are on older version of the app",
                template: 'Please update the app'
            });
        }

        $scope.showPopup = function () {
            // An elaborate, custom popup
            var myPopup = $ionicPopup.show({
                template: '<div class = "row"><span class = "align-center red-font text-center-align">' + $scope.data.message + '</span></div>',
                title: '',
                subTitle: '',
                scope: $scope
            });
            myPopup.then(function (res) {
                console.log('Tapped!', res);
            });
            $timeout(function () {
                myPopup.close(); //close the popup after 3 seconds for some reason
            }, 3000);
        };

    })

    .controller('DashboardCtrl', function ($rootScope, $ionicPlatform, $ionicPush, $scope, $state, $ionicLoading, $ionicPopup, $timeout, GLOBALS, $http, ionicMaterialInk, ionicMaterialMotion, $ionicSideMenuDelegate, $cordovaSQLite, userSessions, userData) {
        $scope.$on("$ionicView.beforeEnter", function (event, data) {
            $ionicLoading.show({
                template: 'Loading...',
                duration: 500
            })
            $scope.goToGallery = function () {
                $state.go("app.gallery")
            }

            $scope.goToTimetable = function () {
                //check if LC is created
                if ($rootScope.lcStatus) {
                    $scope.LcStatus = $rootScope.lcStatus
                    var alertPopup = $ionicPopup.alert({
                        title: 'LC has been generated for this student',
                        template: '  For any information please contact the school'
                    });
                } else {
                    $state.go("app.timetable")
                }
            }
            $scope.showAlert = function () {
                var alertPopup = $ionicPopup.alert({
                    title: 'Under construction!',
                    template: 'To be released soon..! '
                });
            }
            $scope.resultAlert = function () {
                alert("No student history found !");
            }
            $scope.hide = function () {
                $ionicLoading.hide().then(function () {
                    console.log("The loading indicator is now hidden");
                });
            }
        });
        if (userSessions.userSession.bodyId == 1) {
            $scope.title = "Ganesh International School";
        } else if (userSessions.userSession.bodyId == 2) {
            $scope.title = "Ganesh English Medium School";
        }

        $scope.resultView = function () {
            var url = GLOBALS.baseUrl + "user/check-fees/" + userSessions.userSession.userId + "?token=" + userSessions.userSession.userToken;
            $http.get(url).success(function (response) {
                if (response == 0 && userSessions.userSession.userRole == "parent") {
                    $state.go('app.result');
                } else {
                    alert("Please pay fees to view result");
                }
            })
                .error(function (response) {
                    console.log("Error in Response: " + response);
                });

        }
        $scope.$on('cloud:push:notification', function (event, data) {
            switch (data.message.payload.state) {
                case "event":
                    if (userSessions.userSession.userRole == "parent") {
                        $state.go('app.eventlandingparent');
                    } else {
                        $state.go('app.eventlandingteacher');
                    }
                    break;
                case "attendance":
                    if (userSessions.userSession.userRole == "parent") {
                        $state.go('app.parentattendancelanding');
                    } else {
                        $state.go('app.attendancelanding');
                    }
                    break;
                case "leave":
                    if (userSessions.userSession.userRole == "parent") {
                        $state.go('app.parentattendancelanding');
                    } else {
                        $state.go('app.attendancelanding');
                    }
                    break;
                case "achievement":
                    if (userSessions.userSession.userRole == "parent") {
                        $state.go('app.sharedAchievementParent');
                    } else {
                        $state.go('app.sharedAchievement');
                    }
                    break;
                case "announcement":
                    if (userSessions.userSession.userRole == "parent") {
                        $state.go('app.sharedNotifyParent');
                    } else {
                        $state.go('app.sharedNotification');
                    }
                    break;
                case "attendance":
                    if (userSessions.userSession.userRole == "parent") {
                        $state.go('app.parentattendancelanding');
                    } else {
                        $state.go('app.attendancelanding');
                    }
                    break;
            }
        });
        $scope.feelanding = function () {
            if (userSessions.userSession.userRole == "parent") {
                if ($rootScope.lcStatus) {
                    var alertPopup = $ionicPopup.alert({
                        title: 'LC has been generated for this student',
                        template: '  For any information please contact the school'
                    });
                } else {
                    $state.go('app.feelanding');
                }
            } else {
                var alertPopup = $ionicPopup.alert({
                    title: 'Access Denied !',
                    template: ' Contact Admin !'
                });
            }
        }
        $scope.eventlanding = function () {
            if (userSessions.userSession.userRole == "parent") {
                //Check Lc status
                if ($rootScope.lcStatus) {
                    var alertPopup = $ionicPopup.alert({
                        title: 'LC has been generated for this student',
                        template: '  For any information please contact the school'
                    });
                } else {
                    $state.go('app.eventlandingparent');
                }

            }
            else {
                $state.go('app.eventlandingteacher');
            }
        }
        $scope.NoticeboardView = function () {
            if (userSessions.userSession.userRole == "parent") {
                //Check Lc status
                if ($rootScope.lcStatus) {
                    var alertPopup = $ionicPopup.alert({
                        title: 'LC has been generated for this student',
                        template: '  For any information please contact the school'
                    });
                } else {
                    $state.go('app.sharedNotifyParent');
                }
            } else {
                $state.go('app.sharedNotification');
            }
        };
        $scope.$parent.clearFabs();
        $scope.isExpanded = true;
        $scope.$parent.setExpanded(true);
        $scope.$parent.setHeaderFab(false);
        // Set Header
        $scope.$parent.hideHeader();
        // Set Ink
        ionicMaterialInk.displayEffect();
        //Side-Menu
        $ionicSideMenuDelegate.canDragContent(true);
        $timeout(function () {
            ionicMaterialMotion.pushDown({
                selector: '.push-down'
            });
        }, 300);
        $timeout(function () {
            ionicMaterialMotion.fadeSlideInRight({
                selector: '.animate-fade-slide-in .a'
            });
        }, 300);
        $scope.msgCount = '';
        var url = GLOBALS.baseUrl + "user/get-message-count/" + userSessions.userSession.userId + "?token=" + userSessions.userSession.userToken;
        $http.get(url).success(function (response) {
            if (response['data']['Badge_count']['message_count'] > 0) {
                userSessions.setMsgCount(response['data']['Badge_count']['message_count']);
                $scope.msgCount = response['data']['Badge_count']['message_count'];
            } else {
                $scope.msgCount = '';
            }
        })
            .error(function (response) {
                console.log("Error in Response: " + response);
            });
        if (userSessions.userSession.msgcount > 0) {
            $scope.msgCount = userSessions.userSession.msgcount;
        }
    })

    .controller('NotificationCtrl', function ($scope, $state, $timeout, ionicMaterialInk, $ionicSideMenuDelegate) {
        $scope.$parent.clearFabs();
        $scope.isExpanded = false;
        $scope.$parent.setExpanded(false);
        $scope.$parent.setHeaderFab(false);
        // Set Header
        $scope.$parent.hideHeader();
        // Set Ink
        ionicMaterialInk.displayEffect();
        //Side-Menu
        $ionicSideMenuDelegate.canDragContent(true);
        $scope.checkAll = function () {
            if ($scope.selectedAll) {
                $scope.selectedAll = true;
            } else {
                $scope.selectedAll = false;
            }
            angular.forEach($scope.nmessages, function (nmsg) {
                nmsg.Selected = $scope.selectedAll;
            });
        };
    })

    .controller('SharedNotificationCtrl', function ($ionicPopup, $ionicActionSheet, $ionicLoading, $http, userSessions, GLOBALS, $scope, $state, $timeout, ionicMaterialInk, $ionicSideMenuDelegate) {
        $scope.$parent.clearFabs();
        $scope.isExpanded = false;
        $scope.$parent.setExpanded(false);
        $scope.$parent.setHeaderFab(false);
        // Set Header
        $scope.$parent.hideHeader();
        // Set Ink
        ionicMaterialInk.displayEffect();
        $ionicLoading.show({
            template: 'Loading...',
        })
        //Side-Menu
        $scope.showAlert = function (message) {
            var alertPopup = $ionicPopup.alert({
                title: 'Success !',
                template: message
            });
        }
        $scope.editAnnouncement = function () {

        }
        $scope.publish = function (id) {
            $ionicLoading.show();
            var url = GLOBALS.baseUrl + "user/request-to-publish-announcement/" + id + "?token=" + userSessions.userSession.userToken;
            $http.get(url).success(function (response) {
                $state.go('app.dashboard');
                $ionicLoading.hide();
                $scope.showAlert(response['message']);
            })
                .error(function (response) {
                    $state.go('app.dashboard');
                    $ionicLoading.hide();
                    $scope.nMessages = "Problem occurred !";
                    $scope.showAlert($scope.nMessages);
                });
        }
        $ionicSideMenuDelegate.canDragContent(true);
        var url = GLOBALS.baseUrl + "user/view-announcement/" + userSessions.userSession.userId + "?token=" + userSessions.userSession.userToken;
        $http.get(url).success(function (response) {
            $scope.nMessages = response;
            $ionicLoading.hide();
        })
            .error(function (response) {
                $ionicLoading.hide();
            });
        $scope.checkAll = function () {
            if ($scope.selectedAll) {
                $scope.selectedAll = true;
            } else {
                $scope.selectedAll = false;
            }
            angular.forEach($scope.nmessages, function (nmsg) {
                nmsg.Selected = $scope.selectedAll;
            });
        };
    })

    .controller('achievementDetailParentCtrl', function ($rootScope, $ionicLoading, $ionicPopup, $window, $ionicModal, userSessions, $http, GLOBALS, $scope, $state, $timeout, ionicMaterialInk, $ionicSideMenuDelegate) {
        $scope.DetailAchievemtns = $rootScope.DetailAchievemtns;
        $scope.imageData = $rootScope.imagesData;
    })

    .controller('sharedAchievementParentCtrl', function ($rootScope, $ionicLoading, $ionicPopup, $window, $ionicModal, userSessions, $http, GLOBALS, $scope, $state, $timeout, ionicMaterialInk, $ionicSideMenuDelegate) {
        $ionicLoading.show({
            template: 'Loading...',
        })
        $ionicLoading.show();
        var url = GLOBALS.baseUrl + "user/view-achievement-parent?token=" + userSessions.userSession.userToken;
        $http.get(url).success(function (response) {
            $scope.nMessages = response['teacherAchievement'];
            $scope.imagesData = response['imageData'];
            $ionicLoading.hide();
        })
            .error(function (response) {
                $ionicLoading.hide();
            });
        $scope.achievementDetailParent = function (id) {
            $rootScope.DetailAchievemtns = [];
            angular.forEach($scope.nMessages, function (data) {
                if (data.id == id) {
                    $rootScope.DetailAchievemtns.push(data);
                }
            })
            $rootScope.imagesData = [];
            angular.forEach($scope.imagesData, function (dataa) {
                angular.forEach(dataa, function (dataImage) {
                    if (dataImage.event_id == id) {
                        $rootScope.imagesData.push(dataImage);
                    }
                })
            })
            $state.go('app.achievementDetailParent');
        };
    })

    .controller('sharedNotifyParentCtrl', function ($ionicLoading, $ionicPopup, $window, $ionicModal, userSessions, $http, GLOBALS, $scope, $state, $timeout, ionicMaterialInk, $ionicSideMenuDelegate) {
        $ionicLoading.show({
            template: 'Loading...',
        })
        var url = GLOBALS.baseUrl + "user/view-announcement-parent/?token=" + userSessions.userSession.userToken;
        $ionicLoading.show();
        $http.get(url).success(function (response) {
            $scope.nMessages = response;
            $ionicLoading.hide();
        })
            .error(function (response) {
                $ionicLoading.hide();
            });
    })

    .controller('CreateAnnouncementCtrl', function ($ionicPopup, $window, $ionicModal, userSessions, $http, GLOBALS, $scope, $state, $timeout, ionicMaterialInk, $ionicSideMenuDelegate) {
        $scope.$parent.clearFabs();
        $scope.isExpanded = false;
        $scope.$parent.setExpanded(false);
        $scope.$parent.setHeaderFab(false);
        // Set Header
        $scope.$parent.hideHeader();
        // Set Ink
        ionicMaterialInk.displayEffect();
        //Side-Menu
        $ionicSideMenuDelegate.canDragContent(true);
        var url = GLOBALS.baseUrl + "user/get-batches?token=" + userSessions.userSession.userToken;
        $http.get(url).success(function (response) {
            $scope.batchList = response['data'];
        })
            .error(function (response) {
            });
        $scope.getClass = function (batch) {
            var url = GLOBALS.baseUrl + "user/get-classes/" + batch + "?token=" + userSessions.userSession.userToken;
            $http.get(url).success(function (response) {
                $scope.classList = response['data'];
                $scope.className = 'Class';
                $scope.divisionName = 'Div';
                $scope.checkBatch = false;
            })
                .error(function (response) {
                    console.log("Error in Response: " + response);
                });
        };
        $scope.getStudentList = function (divType) {
            var url = GLOBALS.baseUrl + "user/get-students-list/" + divType + "?token=" + userSessions.userSession.userToken;
            $http.get(url)
                .success(function (response) {
                    $scope.contactList = response['data']['studentList'];
                    $scope.openModal();
                })
                .error(function (response) {
                    console.log("Error in Response: " + response);
                });
        };
        $scope.getAdminList = function () {
            var url = GLOBALS.baseUrl + "user/get-admin-list/" + "?token=" + userSessions.userSession.userToken;
            $http.get(url)
                .success(function (response) {
                    $scope.adminList = response;
                    $scope.openModal();
                })
                .error(function (response) {
                    console.log("Error in Response: " + response);
                });
        };
        $scope.getTeacherList = function () {
            var url = GLOBALS.baseUrl + "user/get-teacher-list/" + "?token=" + userSessions.userSession.userToken;
            $http.get(url)
                .success(function (response) {
                    $scope.teacherList = response;
                    $scope.openModal();
                })
                .error(function (response) {
                    console.log("Error in Response: " + response);
                });
        };
        $scope.selectedList = [];
        $scope.toggleSelectionstudent = function (studentId) {
            var idx = $scope.selectedList.indexOf(studentId);
            if (idx > -1) {
                $scope.selectedList.splice(idx, 1);
            }
            // is newly selected
            else {
                $scope.selectedList.push(studentId);
            }
        };
        $scope.selectedListAdmin = [];
        $scope.toggleSelectionAdmin = function (studentId) {
            var idx = $scope.selectedListAdmin.indexOf(studentId);
            if (idx > -1) {
                $scope.selectedListAdmin.splice(idx, 1);
            }
            // is newly selected
            else {
                $scope.selectedListAdmin.push(studentId);
            }
        };
        $scope.selectedListTeacher = [];
        $scope.toggleSelectionTeacher = function (studentId) {
            var idx = $scope.selectedListTeacher.indexOf(studentId);
            if (idx > -1) {
                $scope.selectedListTeacher.splice(idx, 1);
            }
            // is newly selected
            else {
                $scope.selectedListTeacher.push(studentId);
            }
        };
        $scope.titlechange = function (title) {
            $scope.title = title;
        }
        $scope.descriptionchange = function (description) {
            $scope.description = description;
        }
        $scope.priorityChange = function (priority) {
            $scope.priority = priority;
        }
        $scope.onchangeImage = function () {
            $scope.image = $scope.achievementFile;
        }
        $scope.priority = 1;
        $scope.submit = function () {
            var url = GLOBALS.baseUrl + "user/create-announcement?token=" + userSessions.userSession.userToken;
            var dataObj = {
                status: 0,
                title: $scope.title,
                detail: $scope.description,
                priority: $scope.priority,
                user_id: userSessions.userSession.userId,
                studenttt: $scope.selectedList,
                teacherrr: $scope.selectedListTeacher,
                adminnn: $scope.selectedListAdmin
            };
            $http.post(url, dataObj).success(function (response) {
                var message = response['message'];
                $state.go('app.sharedNotification');
                $scope.showAlertsucess(message);
            }).error(function (err) {
                var message = response['message'];
                $state.go('app.sharedNotification');
                $scope.aclMessage = "Access Denied";
                $scope.showAlertsucess(message);
            });
        };
        $scope.showAlertsucess = function (message) {
            var alertPopup = $ionicPopup.alert({
                title: '<img src="img/alert.jpg" height="60px" width="60px">',
                template: message
            })
        }
        $scope.getDivision = function (classType) {
            var url = GLOBALS.baseUrl + "user/get-divisions/" + classType + "?token=" + userSessions.userSession.userToken;
            $http.get(url).success(function (response) {
                $scope.divisionsList = response['data'];
                $scope.checkClass = false;
            })
                .error(function (response) {
                });
        };
        $ionicModal.fromTemplateUrl('my-modal.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.modal = modal;
        });
        $scope.openModal = function () {
            $scope.modal.show();
        };
        $scope.closeModal = function () {
            $scope.modal.hide();
        };
    })

    .controller('EditAchievementCtrl', function ($ionicPopup, userSessions, $state, $ionicLoading, GLOBALS, $http, $scope, $rootScope) {
        $scope.editAchievments = $rootScope.DetailAchievemtns;
        $scope.editAchievmentImages = $rootScope.imagesData;
        angular.forEach($scope.editAchievments, function (data) {
            $scope.editTitle = data.title;
            $scope.editDetail = data.detail;
            $scope.event_id = data.id;
        });
        $scope.changeTitle = function (titleEdit) {
            $scope.editTitle = titleEdit;
        }
        $scope.changeDetail = function (editDetail) {
            $scope.editDetail = editDetail;
        }
        $scope.onchangeImage = function () {
            $scope.image = $scope.achievementFile;
        }
        $scope.onChange = function (e, fileList) {
        }
        $scope.onLoad = function (e, reader, file, fileList, fileOjects, fileObj) {
            $scope.image = fileObj.base64;
        }
        $scope.upload = function () {
            console.log($scope.image);
            console.log($scope.achievementImageName);
        }
        $scope.publish = function () {
            $scope.status = 1;
            $ionicLoading.show();
            var url = GLOBALS.baseUrl + "user/publish-achievement?token=" + userSessions.userSession.userToken;
            $http.post(url, { status: $scope.status, title: $scope.editTitle, detail: $scope.editDetail, event_id: $scope.event_id }).success(function (response) {
                var message = response['message'];
                $state.go('app.sharedAchievement');
                $ionicLoading.hide();
                $scope.showAlertsucess(message);
            }).error(function (err) {
                var message = response['message'];
                $state.go('app.sharedAchievement');
                $scope.aclMessage = "Access Denied";
                $ionicLoading.hide();
                $scope.showAlertsucess(message);
            });
        }
        $scope.edit = function () {
            $ionicLoading.show();
            var url = GLOBALS.baseUrl + "user/edit-achievement?token=" + userSessions.userSession.userToken;
            $http.post(url, { title: $scope.editTitle, detail: $scope.editDetail, event_id: $scope.event_id }).success(function (response) {
                var message = response['message'];
                $state.go('app.sharedAchievement');
                $ionicLoading.hide();
                $scope.showAlertsucess(message);
            }).error(function (err) {
                var message = response['message'];
                $state.go('app.sharedAchievement');
                $scope.aclMessage = "Access Denied";
                $ionicLoading.hide();
                $scope.showAlertsucess(message);
            });
        };
        $scope.showAlertsucess = function (message) {
            var alertPopup = $ionicPopup.alert({
                title: '<img src="img/alert.jpg" height="60px" width="60px">',
                template: message
            })
        }
    })

    .controller('SharedAchievementCtrl', function ($rootScope, userSessions, GLOBALS, $http, $scope, $state, $timeout, ionicMaterialInk, $ionicSideMenuDelegate, $ionicLoading) {
        $scope.$parent.clearFabs();
        $scope.isExpanded = false;
        $scope.$parent.setExpanded(false);
        $scope.$parent.setHeaderFab(false);
        // Set Header
        $scope.$parent.hideHeader();
        // Set Ink
        ionicMaterialInk.displayEffect();
        $ionicLoading.show({
            template: 'Loading...',
        })
        $ionicLoading.show();
        //Side-Menu
        $scope.achievementDetail = function (id) {
            $rootScope.DetailAchievemtns = [];
            console.log($scope.nmessages)
            angular.forEach($scope.nmessages, function (data) {
                if (data.id == id) {
                    $rootScope.DetailAchievemtns.push(data);
                }
            })
            $rootScope.imagesData = [];
            angular.forEach($scope.imageData, function (dataa) {
                angular.forEach(dataa, function (dataImage) {
                    if (dataImage.event_id == id) {
                        $rootScope.imagesData.push(dataImage);
                    }
                })
            })
            $state.go('app.achievementdetails');
        };
        $ionicSideMenuDelegate.canDragContent(true);
        var url = GLOBALS.baseUrl + "user/view-achievement/" + userSessions.userSession.userRole + "?token=" + userSessions.userSession.userToken;
        $http.get(url).success(function (response) {
            $ionicLoading.hide();
            $scope.nmessages = response['teacherAchievement'];
            $scope.imageData = response['imageData'];
        })
            .error(function (response) {
                $ionicLoading.hide();
                console.log("Error in Response: " + response);
            });
        $scope.checkAll = function () {
            if ($scope.selectedAll) {
                $scope.selectedAll = true;
            } else {
                $scope.selectedAll = false;
            }
            angular.forEach($scope.nmessages, function (nmsg) {
                nmsg.Selected = $scope.selectedAll;
            });
        };
    })

    .controller('CreateAchievementCtrl', function ($ionicPopup, userSessions, $http, GLOBALS, $ionicLoading, $scope, $state, $timeout, ionicMaterialInk, $ionicSideMenuDelegate) {
        $scope.$parent.clearFabs();
        $scope.isExpanded = false;
        $scope.$parent.setExpanded(false);
        $scope.$parent.setHeaderFab(false);
        // Set Header
        $scope.$parent.hideHeader();
        // Set Ink
        ionicMaterialInk.displayEffect();
        //Side-Menu
        $ionicSideMenuDelegate.canDragContent(true);
        $scope.titleChange = function (title) {
            $scope.title = title;
        }
        $scope.detailChange = function (detail) {
            $scope.detail = detail;
        }
        $scope.priorityChange = function (priority) {
            $scope.priority = priority;
        }
        $scope.onChange = function (e, fileList) {
        }
        $scope.image = [];
        $scope.onLoad = function (e, reader, file, fileList, fileOjects, fileObj) {
            $scope.image.push(fileObj.base64);
        }
        $scope.create = function () {
            $ionicLoading.show();
            var url = GLOBALS.baseUrl + "user/create-achievement?token=" + userSessions.userSession.userToken;
            $http.post(url, { image: $scope.image, status: 0, title: $scope.title, detail: $scope.detail, user_id: userSessions.userSession.userId }).success(function (response) {
                var message = response['message'];
                $state.go('app.sharedAchievement');
                $ionicLoading.hide();
                $scope.showAlertsucess(message);
            }).error(function (err) {
                var message = response['message'];
                $state.go('app.sharedAchievement');
                $scope.aclMessage = "Access Denied";
                $ionicLoading.hide();
                $scope.showAlertsucess(message);
            });
        };
        $scope.showAlertsucess = function (message) {
            var alertPopup = $ionicPopup.alert({
                title: '<img src="img/alert.jpg" height="60px" width="60px">',
                template: message
            })
        }
    })

    .controller('HomeworkCtrl', function ($ionicLoading, $scope, $state, $ionicPopup, hwDetails, userSessions, $http, GLOBALS, $timeout, ionicMaterialInk, $ionicSideMenuDelegate) {
        $scope.$parent.clearFabs();
        $scope.isExpanded = false;
        $scope.$parent.setExpanded(false);
        $scope.$parent.setHeaderFab(false);
        // Set Header
        $scope.$parent.hideHeader();
        // Set Ink
        ionicMaterialInk.displayEffect();
        //Side-Menu
        $ionicSideMenuDelegate.canDragContent(true);
        if (userSessions.userSession.userToken == 0) {
            $state.go('login');
        }
        $scope.clickStatus = false;
        var url = GLOBALS.baseUrl + "user/view-homework?token=" + userSessions.userSession.userToken;
        $ionicLoading.show();
        $http.get(url)
            .success(function (response) {
                $ionicLoading.hide();
                if (response['status'] == 200) {
                    $scope.homeworksListing = response['data'];
                    if ($scope.homeworksListing == '') {
                        $scope.errorMessage = response['message'];
                        $scope.showPopup();
                    }
                }
                else {
                    $scope.errorMessage = response['message'];
                    $scope.showPopup();
                }
            })
            .error(function (response) {
                console.log("Error in Response: " + response);
                $scope.errorMessage = "Access Denied";
                $scope.showPopup();
            });

        $scope.hwDetail = function (hwd) {
            $scope.checkHid = hwDetails.setHwView(hwd);
            if ($scope.checkHid == true) {
                $state.go('app.teacherhwdetail');
            };
        };
        $scope.showPopup = function () {
            // An elaborate, custom popup
            var myPopup = $ionicPopup.show({
                template: '<div class = "row"><span class = "align-center red-font text-center-align">' + $scope.errorMessage + '</span></div>',
                title: '',
                subTitle: '',
                scope: $scope
            });
            myPopup.then(function (res) {
                console.log('Tapped!', res);
            });
            $timeout(function () {
                myPopup.close(); //close the popup after 3 seconds for some reason
            }, 3000);
        };
    })

    .controller('UnpubHwListCtrl', function ($scope, $state, $ionicPopup, hwDetails, userSessions, $http, GLOBALS, $timeout, ionicMaterialInk, $ionicSideMenuDelegate, $ionicLoading) {
        $scope.$parent.clearFabs();
        $scope.isExpanded = false;
        $scope.$parent.setExpanded(false);
        $scope.$parent.setHeaderFab(false);
        // Set Header
        $scope.$parent.hideHeader();
        // Set Ink
        ionicMaterialInk.displayEffect();
        //Side-Menu
        $ionicSideMenuDelegate.canDragContent(true);
        if (userSessions.userSession.userToken == 0) {
            $state.go('login');
        }
        $scope.clickStatus = false;
        $scope.publishHw = function (hwId) {
            $ionicLoading.show({
                template: 'Loading...',
            })
            $ionicLoading.show();
            var url = GLOBALS.baseUrl + "user/publish-homework?token=" + userSessions.userSession.userToken;
            $http.post(url, { _method: 'PUT', homework_id: hwId }).success(function (response) {
                $scope.errorMessage = response['message'];
                $ionicLoading.hide();
                $scope.showPopup();
                $scope.loadUnpHw();
            }).error(function (err) {
                console.log(err);
                $scope.aclMessage = "Access Denied";
                $ionicLoading.hide();
                $scope.showPopup();
                $state.go('app.homework');
            });
        };
        $scope.loadUnpHw = function () {
            var url = GLOBALS.baseUrl + "user/view-unpublished-homework?token=" + userSessions.userSession.userToken;
            $http.get(url).success(function (response) {
                if (response['status'] == 200) {
                    $scope.homeworksListing = response['data'];
                    if ($scope.homeworksListing == '') {
                        $scope.errorMessage = response['message'];
                        $scope.showPopup();
                    }
                }
                else {
                    $scope.errorMessage = response['message'];
                    $scope.showPopup();
                }
            })
                .error(function (response) {
                    console.log("Error in Response: " + response);
                    $scope.errorMessage = "Access Denied";
                    $scope.showPopup();
                });
        };

        $scope.loadUnpHw();
        $scope.hwDetail = function (hwd) {
            $scope.checkHid = hwDetails.setHwView(hwd);
            if ($scope.checkHid == true) {
                $state.go('app.homeworkedit');
            }
        };

        $scope.confirmDelete = function (hwId) {
            $scope.hwId = hwId;
            $scope.showConfirmBox();
        };

        $scope.deleteHomework = function () {

            var url = GLOBALS.baseUrl + "user/deleteHomework?token=" + userSessions.userSession.userToken;
            $http.post(url, { _method: 'PUT', homework_id: $scope.hwId }).success(function (response) {
                $scope.loadUnpHw();
            }).error(function (err) {
                console.log(err);
                $scope.aclMessage = "Access Denied";
                $scope.showPopup();
            });
        };

        $scope.showConfirmBox = function () {
            // An elaborate, custom popup
            var myPopup = $ionicPopup.show({
                template: '<div class = "row"><span class = "align-center red-font text-center-align">This will delete the Homework</span></div>',
                title: 'Press Confirm to Delete',
                subTitle: '',
                scope: $scope,
                buttons: [
                    {
                        text: '<b>Close</b>',
                        type: 'button-calm',
                        onTap: function (e) {
                            myPopup.close();
                        }
                    },
                    {
                        text: '<b>Delete</b>',
                        type: 'button-assertive',
                        onTap: function (e) {
                            $scope.deleteHomework();
                        }
                    }
                ]

            });
            myPopup.then(function (res) {
                console.log('Tapped!', res);
            });
        };

        $scope.showPopup = function () {
            // An elaborate, custom popup
            var myPopup = $ionicPopup.show({
                template: '<div class = "row"><span class = "align-center red-font text-center-align">' + $scope.errorMessage + '</span></div>',
                title: '',
                subTitle: '',
                scope: $scope
            });
            myPopup.then(function (res) {
                console.log('Tapped!', res);
            });
            $timeout(function () {
                myPopup.close(); //close the popup after 3 seconds for some reason
            }, 3000);
        };
    })

    .controller('ParentHomeworkCtrl', function ($scope, $state, $timeout, $http, $ionicPopup, hwDetails, GLOBALS, userSessions, ionicMaterialInk, $ionicSideMenuDelegate) {

        $scope.$parent.clearFabs();
        $scope.isExpanded = false;
        $scope.$parent.setExpanded(false);
        $scope.$parent.setHeaderFab(false);

        // Set Header
        $scope.$parent.hideHeader();

        // Set Ink
        ionicMaterialInk.displayEffect();

        //Side-Menu
        $ionicSideMenuDelegate.canDragContent(true);
        if (userSessions.userSession.userToken == 0) {
            $state.go('login');
        }

        $scope.clickStatus = false;
        var url = GLOBALS.baseUrl + "user/view-homework-parent/" + userSessions.userSession.userId + "?token=" + userSessions.userSession.userToken;
        $http.get(url)
            .success(function (response) {
                console.log(response);
                if (response['status'] == 200) {
                    $scope.homeworksListing = response['data'];
                    if ($scope.homeworksListing == '') {
                        $scope.errorMessage = response['message'];
                        $scope.showPopup();
                    }
                }
                else if (response['status'] == 202) {
                    $scope.errorMessage = response['message'];
                    $scope.showPopup();
                }
                else {
                    $scope.errorMessage = response['message'];
                    $scope.showPopup();
                }
            })
            .error(function (response) {
                console.log("Error in Response: " + response);
                $scope.errorMessage = "Access Denied";
                $scope.showPopup();
            });

        $scope.hwDetail = function (hwd) {
            $scope.checkHid = hwDetails.setHwView(hwd);
            if ($scope.checkHid == true) {
                $state.go('app.homeworkdetails');
            };
        };

        $scope.showPopup = function () {
            // An elaborate, custom popup
            var myPopup = $ionicPopup.show({
                template: '<div class = "row"><span class = "align-center red-font text-center-align">' + $scope.errorMessage + '</span></div>',
                title: '',
                subTitle: '',
                scope: $scope
            });
            myPopup.then(function (res) {
                console.log('Tapped!', res);
            });
            $timeout(function () {
                myPopup.close(); //close the popup after 3 seconds for some reason
            }, 3000);
        };
    })

    .controller('THWdetailCtrl', function ($cordovaFileTransfer, $ionicLoading, $scope, $state, hwDetails, userSessions, $timeout, GLOBALS, $http, ionicMaterialInk, $ionicSideMenuDelegate, $ionicModal) {
        $scope.$parent.clearFabs();
        $scope.isExpanded = false;
        $scope.$parent.setExpanded(false);
        $scope.$parent.setHeaderFab(false);

        // Set Header
        $scope.$parent.hideHeader();

        // Set Ink
        ionicMaterialInk.displayEffect();

        //Side-Menu
        $ionicSideMenuDelegate.canDragContent(true);
        $scope.hwrkDetail = hwDetails.getHwView();
        $scope.hwId = $scope.hwrkDetail.homework_id;
        $scope.fileName = $scope.hwrkDetail.attachment_file.split('/').pop();
        $scope.fileExtention = $scope.hwrkDetail.attachment_file.split('.').pop();
        var permissions = cordova.plugins.permissions;

        $scope.downloadDocument = function () {
            var url = $scope.hwrkDetail.attachment_file;
            var filename = url.split("/").pop();
            var targetPath = cordova.file.externalRootDirectory+ "/Download/SSPShikshanSanstha/Homeworks/" + filename;
            $cordovaFileTransfer.download(url, targetPath, {}, true).then(function (result) {
                $ionicLoading.hide();
                console.log('Success');
                $scope.hasil = 'Save file on ' + targetPath + ' success!';
                $scope.mywallpaper = targetPath;
                alert('Your download is completed \n File is downloaded at /Download/SSPShikshanSanstha/Homeworks/');
            }, function (error) {
                $ionicLoading.hide();
                console.log('Error downloading file');
                $scope.hasil = 'Error downloading file...';
                alert('Your download has failed');
                console.log(error)
            }, function (progress) {
                console.log('progress');
                $scope.downloadProgress = (progress.loaded / progress.total) * 100;
                // var downcountString = $scope.downloadProgress.toFixed();
                // console.log('downcountString');
                // $scope.downloadCount = downcountString;
            });
        }
        $scope.checkStoragePermissionAndDownload = function () {
            permissions.checkPermission(permissions.READ_EXTERNAL_STORAGE, function (status) {
                if (status.checkPermission) {
                    $scope.downloadDocument();
                }
                else {
                    permissions.requestPermission(permissions.WRITE_EXTERNAL_STORAGE, success, error);
                    function error() {
                        alert("App dosen't have storage permission");
                    }

                    function success(status) {
                        if (!status.hasPermission) error();
                        console.log("Permission Granted")
                        $ionicLoading.show();
                        $scope.downloadDocument();
                    }
                }
            });
        }

        var url = GLOBALS.baseUrl + "user/view-detail-homework/" + $scope.hwId + "?token=" + userSessions.userSession.userToken;
        $http.get(url).success(function (response) {
            console.log(response);
            $scope.contactList = response['data']['studentList'];
        })
            .error(function (response) {
                console.log("Error in Response: " + response);
            });

        $ionicModal.fromTemplateUrl('studentlist.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.modal = modal;
        })

        $scope.openModal = function () {
            $scope.modal.show();
        }

        $scope.closeModal = function () {
            $scope.modal.hide();
        };

        $scope.$on('$destroy', function () {
            $scope.modal.remove();
        });
    })

    .controller('HWdetailCtrl', function ($cordovaFileTransfer, $scope, $state, hwDetails, $timeout, ionicMaterialInk, $ionicSideMenuDelegate, $ionicModal) {
        $scope.$parent.clearFabs();
        $scope.isExpanded = false;
        $scope.$parent.setExpanded(false);
        $scope.$parent.setHeaderFab(false);

        // Set Header
        $scope.$parent.hideHeader();

        // Set Ink
        ionicMaterialInk.displayEffect();

        //Side-Menu
        $ionicSideMenuDelegate.canDragContent(true);
        $scope.hwrkDetail = hwDetails.getHwView();
        console.log($scope.hwrkDetail);
        $scope.fileName = $scope.hwrkDetail.attachment_file.split('/').pop();
        $scope.fileExtention = $scope.hwrkDetail.attachment_file.split('.').pop();
        console.log($scope.fileExtention)
        $scope.fileExtentionLength = ($scope.fileExtention).length;
        var permissions = cordova.plugins.permissions;

        $scope.downloadDocument = function () {
            var url = $scope.hwrkDetail.attachment_file;
            var filename = url.split("/").pop();
            var targetPath = cordova.file.externalRootDirectory + "/Download/SSPShikshanSanstha/Homeworks/" + filename;
            $cordovaFileTransfer.download(url, targetPath, {}, true).then(function (result) {
                console.log('Success');
                $scope.hasil = 'Save file on ' + targetPath + ' success!';
                $scope.mywallpaper = targetPath;
                alert('Your download is completed \n File is downloaded at /Download/SSPShikshanSanstha/Homeworks/');
            }, function (error) {
                console.log('Error downloading file');
                $scope.hasil = 'Error downloading file...';
                alert('Your download has failed');
                console.log(error)
            }, function (progress) {
                console.log('progress');
                $scope.downloadProgress = (progress.loaded / progress.total) * 100;
                // var downcountString = $scope.downloadProgress.toFixed();
                // console.log('downcountString');
                // $scope.downloadCount = downcountString;
            });
        }
        $scope.checkStoragePermissionAndDownload = function () {
            permissions.checkPermission(permissions.READ_EXTERNAL_STORAGE, function (status) {
                if (status.checkPermission) {
                    $scope.downloadDocument();
                }
                else {
                    permissions.requestPermission(permissions.WRITE_EXTERNAL_STORAGE, success, error);
                    function error() {
                        alert("App dosen't have storage permission");
                    }

                    function success(status) {
                        if (!status.hasPermission) error();
                        console.log("Permission Granted")
                        $scope.downloadDocument();
                    }
                }
            });
        }
    })

    .controller('EditHomeworkCtrl', function ($scope, $state, $ionicPopup, $timeout, $filter, hwDetails, GLOBALS, userSessions, $http, ionicMaterialInk, $ionicSideMenuDelegate, $ionicModal, $ionicLoading) {

        $scope.$parent.clearFabs();
        $scope.isExpanded = false;
        $scope.$parent.setExpanded(false);
        $scope.$parent.setHeaderFab(false);

        // Set Header
        $scope.$parent.hideHeader();

        // Set Ink
        ionicMaterialInk.displayEffect();

        //Side-Menu
        $ionicSideMenuDelegate.canDragContent(true);
        $scope.editHwData = hwDetails.getHwView();
        $scope.hwId = $scope.editHwData.homework_id;
        $scope.contactList = $scope.editHwData.studentList;
        $scope.SubjectId = $scope.editHwData.subject_id;
        $scope.SubjectName = $scope.editHwData.subjectName;
        $scope.BatchId = $scope.editHwData.batch_id;
        $scope.BatchName = $scope.editHwData.batch_name;

        $scope.image = $scope.editHwData.attachment_file;
        $scope.hwTitle = $scope.editHwData.homeworkTitle;
        $scope.classId = $scope.editHwData.class_id;
        $scope.divId = $scope.editHwData.division_id;
        $scope.className = $scope.editHwData.class_name;
        $scope.divName = $scope.editHwData.division_name;
        $scope.defaultList = [];
        $scope.selectedList = [];
        $scope.classList = [];
        $scope.divisionsList = [];
        angular.forEach($scope.contactList, function (item) {
            $scope.selectedList.push(item.id);
            $scope.defaultList.push(item.id);
            $scope.$watch(function (scope) { return scope.selectedList },
                function (newValue, oldValue) {
                    if (newValue.length == $scope.contactList.length) {
                        $scope.recipient = $scope.selectedList.length + " Student Selected";
                        $scope.getStudentList($scope.divId, 1);
                    }
                }
            );
        });
        $scope.minDate = new Date();
        $scope.minDate = $filter('date')($scope.minDate, "yyyy-MM-dd");
        $scope.dueDate = new Date();
        $scope.description = $scope.editHwData.description;
        $scope.hwTypeId = $scope.editHwData.homeworkTypeId;
        $scope.hwrkType = $scope.editHwData.homeworkType;
        $scope.setTitle = function (title) {
            $scope.hwTitle = title;

        };

        $scope.setDescription = function (message) {
            $scope.description = message;
        };
        // toggle selection for a given student by name
        $scope.toggleSelection = function (studentId) {
            var idx = $scope.selectedList.indexOf(studentId);
            if (idx > -1) {
                $scope.selectedList.splice(idx, 1);
            }
            // is newly selected
            else {
                $scope.selectedList.push(studentId);
            }

            $scope.$apply();
            $scope.$digest();

        };

        var url = GLOBALS.baseUrl + "user/get-teachers-subjects?token=" + userSessions.userSession.userToken;
        $http.get(url)
            .success(function (response) {
                $scope.subjectsList = response['data'];
            })
            .error(function (response) {
                console.log("Error in Response: " + response);
            });

        var hwTypeurl = GLOBALS.baseUrl + "user/get-homework-types?token=" + userSessions.userSession.userToken;

        $http.get(hwTypeurl)
            .success(function (response) {
                $scope.hwTypeList = response['data'];
            })
            .error(function (response) {
                console.log("Error in Response: " + response);
            });


        $scope.getSelectedHwType = function (hwtype) {
            $scope.hwTypeId = hwtype['id'];
        };

        $scope.updateDueDate = function (newDate) {
            $scope.dueDate = newDate;
        }

        $scope.getSelectedSub = function (subject) {
            $scope.recipient = "Select Student";
            $scope.BatchName = "Batch";
            $scope.checkRecipient = true;
            $scope.contactList.length = 0;
            var url = GLOBALS.baseUrl + "user/get-subjects-batches/" + subject['id'] + "?token=" + userSessions.userSession.userToken;
            $http.get(url).success(function (response) {
                $scope.batchList = response['data'];
                $scope.SubjectId = subject['id'];
            })
                .error(function (response) {
                    console.log("Error in Response: " + response);
                });
        };

        $scope.getClass = function (batch) {
            $scope.className = "Class";
            var url = GLOBALS.baseUrl + "user/get-batches-classes/" + $scope.SubjectId + "/" + batch['id'] + "?token=" + userSessions.userSession.userToken;
            $http.get(url).success(function (response) {
                $scope.classList = response['data'];
                $scope.BatchId = batch['id'];
                $scope.divName = "-Div-";
                $scope.divisionsList.length = 0;
                $scope.contactList.length = 0;
                $scope.selectedList.length = 0;
                $scope.defaultList.length = 0;
                $scope.recipient = $scope.selectedList.length + " Student Selected";

            })
                .error(function (response) {
                    console.log("Error in Response: " + response);
                });
        };

        $scope.getDivision = function (classType) {
            var url = GLOBALS.baseUrl + "user/get-classes-division/" + $scope.SubjectId + "/" + $scope.BatchId + "/" + classType['id'] + "?token=" + userSessions.userSession.userToken;
            $http.get(url).success(function (response) {
                $scope.divisionsList = response['data'];
                $scope.classId = classType['id'];
                $scope.selectedList.length = 0;
                $scope.defaultList.length = 0;
                $scope.contactList.length = 0;
                $scope.recipient = $scope.selectedList.length + " Student Selected";
            })
                .error(function (response) {
                    console.log("Error in Response: " + response);
                });
        };


        $scope.getStudentList = function (divType, setClear) {
            if (setClear == 0) {
                $scope.selectedList.length = 0;
            }
            var url = GLOBALS.baseUrl + "user/get-students-list/" + divType + "?token=" + userSessions.userSession.userToken;
            $http.get(url)
                .success(function (response) {
                    $scope.contactList.length = 0;
                    $scope.recipient = $scope.selectedList.length + " Student Selected";
                    $scope.contactList = response['data']['studentList'];
                    $scope.checkRecipient = false;
                    $scope.divId = divType;
                })
                .error(function (response) {
                    console.log("Error in Response: " + response);
                });
        };
        $ionicModal.fromTemplateUrl('studentHwCntctlist.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.modal = modal;
        })

        $scope.openModal = function () {
            $scope.modal.show();
        }

        $scope.closeModal = function () {
            $scope.modal.hide();
        };

        $scope.$on('$destroy', function () {
            $scope.modal.remove();
        });

        $scope.selectedAll = false;


        $scope.checkAll = function () {
            $scope.selectedList.length = 0;
            $scope.selectedAll = !$scope.selectedAll;
            if ($scope.selectedAll == true) {

                angular.forEach($scope.contactList, function (item) {
                    $scope.toggleSelection(item.id);
                });
            }
        };

        $scope.sendTo = function () {
            $scope.recipient = $scope.selectedList.length + " Student selected";
            $scope.defaultList.length = 0;
            angular.forEach($scope.selectedList, function (item) {
                $scope.defaultList.push(item);

            });
            $scope.closeModal();
        };


        $scope.cancelList = function () {
            $scope.selectedList.length = 0;
            angular.forEach($scope.defaultList, function (item) {
                $scope.selectedList.push(item);
            });


            $scope.recipient = $scope.selectedList.length + " Student selected";
            $scope.closeModal();
        };

        $scope.saveDraft = function () {
            $ionicLoading.show({ template: 'Loading...', })
            $ionicLoading.show();
            $scope.dueDate = $filter('date')($scope.dueDate, "yyyy-MM-dd");
            $scope.minDate = $filter('date')($scope.minDate, "yyyy-MM-dd");
            if ($scope.dueDate >= $scope.minDate) {
                if ($scope.selectedList.length <= 0) {
                    $scope.msg = "Please Add Recipient";
                    $ionicLoading.hide();
                    $scope.showPopup();

                } else {
                    if ($scope.hwTitle == '' || $scope.dueDate == '' || $scope.description == '' || $scope.selectedList.length <= 0 || $scope.hwTypeId == '') {
                        $scope.msg = "Check if all fields are filled";
                        $ionicLoading.hide();
                        $scope.showPopup();
                    }
                    else {
                        var url = GLOBALS.baseUrl + "user/update-homework?token=" + userSessions.userSession.userToken;

                        $http.post(url, {
                            _method: 'PUT',
                            homework_id: $scope.hwId,
                            subject_id: $scope.SubjectId,
                            title: $scope.hwTitle,
                            batch_id: $scope.BatchId,
                            class_id: $scope.classId,
                            division_id: $scope.divId,
                            due_date: $scope.dueDate,
                            student: $scope.selectedList,
                            description: $scope.description,
                            homework_type: $scope.hwTypeId,
                            attachment_file: ''
                        }).success(function (response) {
                            console.log("user/update-homework?token=")
                            console.log(response)
                            if (response['status'] == 200) {
                                $scope.msg = response['message'];
                                $ionicLoading.hide();
                                $scope.showPopup();
                                $state.go('app.edithomeworklisting');
                            }
                            else {
                                $scope.msg = response['message'];
                                $ionicLoading.hide();
                                $scope.showPopup();
                            }
                        }).error(function (response) {
                            console.log("Error in Response: " + response);
                            if (response.hasOwnProperty('status')) {
                                $scope.msg = response.message;
                            }
                            else {
                                $scope.msg = "Access Denied";
                            }
                            $ionicLoading.hide();
                            $scope.showPopup();
                        });
                    }
                }
            } else {
                $scope.msg = "Due Date should be greater than Current Date";
                $ionicLoading.hide();
                $scope.showPopup();
            }

        };

        $scope.showPopup = function () {
            // An elaborate, custom popup
            var myPopup = $ionicPopup.show({
                template: '<div>' + $scope.msg + '</div>',
                title: '',
                subTitle: '',
                scope: $scope
            });
            myPopup.then(function (res) {
                console.log('Tapped!', res);
            });
            $timeout(function () {
                myPopup.close(); //close the popup after 8 seconds for some reason
            }, 3000);
        };
    })

    .controller('ResultCntrl', function ($stateParams, $window, $rootScope, $scope, $state, $ionicPopup, $filter, $timeout, GLOBALS, userSessions, $http, ionicMaterialInk, $ionicSideMenuDelegate, $ionicModal, $cordovaImagePicker, $ionicPlatform, $ionicLoading) {
        var url = GLOBALS.baseUrl + "user/get-exam-terms/" + userSessions.userSession.userId + "?token=" + userSessions.userSession.userToken;
        $http.get(url).success(function (response) {
            $scope.subjects = response['data'];
        })
            .error(function (response) {
                console.log("Error in Response: " + response);
            });

        $scope.getSubjectDetails = function (id, subject_name) {
            var url = GLOBALS.baseUrl + "user/get-subject-details/" + id + "?token=" + userSessions.userSession.userToken;
            $http.get(url).success(function (response) {
                $rootScope.subjectData = response['data'];
                $state.go('app.resultSubjectDetail', { "obj": subject_name });
            })
                .error(function (response) {
                    console.log("Error in Response: " + response);
                    alert("Something went wrong");
                });
        }
    })

    .controller('ResultSubjectDetailCntrl', function ($stateParams, $window, $rootScope, $scope, $state, $ionicPopup, $filter, $timeout, GLOBALS, userSessions, $http, ionicMaterialInk, $ionicSideMenuDelegate, $ionicModal, $cordovaImagePicker, $ionicPlatform, $ionicLoading) {
        $scope.terms = $rootScope.subjectData;
        $scope.term_id = "";
        $scope.subjectName = $state.params.obj;
        $scope.getSubjectMarks = function (id) {
            var url = GLOBALS.baseUrl + "user/get-term-data/" + id + '/' + userSessions.userSession.userId + "?token=" + userSessions.userSession.userToken;
            $http.get(url).success(function (response) {
                $scope.termData = response['data']['term_data'];
                $scope.total = response['data']['total'];
                $scope.grade = response['data']['grade'];
                $scope.totalMarksObtained = response['data']['total_marks_obtained'];
            })
                .error(function (response) {
                    console.log("Error in Response: " + response);
                    alert("Something went wrong");
                });
        }
    })

    .controller('HwComposeCtrl', function ($cordovaFileTransfer, $window, $rootScope, $scope, $state, $ionicPopup, $filter, $timeout, GLOBALS, userSessions, $http, ionicMaterialInk, $ionicSideMenuDelegate, $ionicModal, $cordovaImagePicker, $ionicPlatform, $ionicLoading) {

        $scope.onChange = function (e, fileList) {

        }

        $scope.onLoad = function (e, reader, file, fileList, fileOjects, fileObj) {
            if (fileObj.filesize > 2e+6) {
                var myPopup = $ionicPopup.show({
                    template: '',
                    title: 'File too large',
                    subTitle: 'File size must be less than 2 MB',
                });
                $timeout(function () {
                    myPopup.close();
                }, 2000);
            } else {
                $scope.image = fileObj.base64;
                $scope.imageExtention = fileObj.filetype;
            }
        }


        var uploadedCount = 0;
        $scope.files = [];
        $scope.$parent.clearFabs();
        $scope.isExpanded = false;
        $scope.$parent.setExpanded(false);
        $scope.$parent.setHeaderFab(false);
        $scope.Batch = "Batch";
        $scope.Class = "Class";
        $scope.Division = "Division";
        // Set Header
        $scope.$parent.hideHeader();
        // Set Ink
        ionicMaterialInk.displayEffect();
        var url = GLOBALS.baseUrl + "user/get-acl-details?token=" + userSessions.userSession.userToken;
        $http.get(url).success(function (response) {
            $scope.data = response['Data']['Acl_Modules'];
            if ($scope.data.indexOf('Create_homework') == -1) {
                $scope.msg = "Access Denied";
                $scope.showPopup();
                $state.go('app.homeworklanding');
            }
        }).error(function (err) {
            console.log(err);
        });


        //Side-Menu
        $ionicSideMenuDelegate.canDragContent(true);
        $scope.recipient = "Select Student";
        $scope.checkRecipient = true;
        $scope.SubjectId = '';
        $scope.BatchId = '';
        $scope.selectedList = [];
        $scope.hwTitle = '';
        $scope.classId = '';
        $scope.divId = '';
        $scope.dueDate = new Date();
        $scope.description = '';
        $scope.hwTypeId = '';
        $scope.contactList = [];
        $scope.minDate = new Date();

        $scope.minDate = $filter('date')($scope.minDate, "yyyy-MM-dd");

        $scope.setTitle = function (title) {
            $scope.hwTitle = title;
        };
        $scope.setDescription = function (message) {
            $scope.description = message;
        };
        $scope.updateDueDate = function (newDate) {
            $scope.dueDate = newDate;
        };
        $scope.toggleSelection = function (studentId) {
            var idx = $scope.selectedList.indexOf(studentId);
            if (idx > -1) {
                $scope.selectedList.splice(idx, 1);
            }
            // is newly selected
            else {
                $scope.selectedList.push(studentId);
            }
            $scope.$apply();
            $scope.$digest();
        };
        var url1 = GLOBALS.baseUrl + "user/get-teachers-subjects?token=" + userSessions.userSession.userToken;
        $http.get(url1)

            .success(function (response) {
                $scope.subjectsList = response['data'];
            })
            .error(function (response) {
                console.log("Error in Response: " + response);
            });

        var hwTypeurl = GLOBALS.baseUrl + "user/get-homework-types?token=" + userSessions.userSession.userToken;
        $http.get(hwTypeurl)
            .success(function (response) {
                $scope.hwTypeList = response['data'];
            })
            .error(function (response) {
                console.log("Error in Response: " + response);
            });

        $scope.getSelectedHwType = function (hwtype) {
            $scope.hwTypeId = hwtype['id'];
        };

        $scope.getSelectedSub = function (subject) {
            $scope.recipient = "Select Student";
            $scope.Batch = "Batch";
            $scope.Class = "Class";
            $scope.Division = "Division";
            $scope.checkRecipient = true;
            $scope.contactList.length = 0;
            var url = GLOBALS.baseUrl + "user/get-subjects-batches/" + subject['id'] + "?token=" + userSessions.userSession.userToken;
            $http.get(url).success(function (response) {
                $scope.batchList = response['data'];
                $scope.SubjectId = subject['id'];
            })
                .error(function (response) {
                    console.log("Error in Response: " + response);
                });
        };
        $scope.getClass = function (batch) {
            if (batch['id'] == null) {
                $scope.classList = "null";
            }
            $scope.recipient = "Select Student";
            var url = GLOBALS.baseUrl + "user/get-batches-classes/" + $scope.SubjectId + "/" + batch['id'] + "?token=" + userSessions.userSession.userToken;
            $http.get(url).success(function (response) {
                $scope.classList = response['data'];
                $scope.BatchId = batch['id'];
                $scope.contactList.length = 0;
            })
                .error(function (response) {
                    console.log("Error in Response: " + response);
                });
        };

        $scope.getDivision = function (classType) {
            $scope.recipient = "Select Student";
            var url = GLOBALS.baseUrl + "user/get-classes-division/" + $scope.SubjectId + "/" + $scope.BatchId + "/" + classType['id'] + "?token=" + userSessions.userSession.userToken;
            $http.get(url).success(function (response) {
                $scope.divisionsList = response['data'];
                $scope.classId = classType['id'];
                $scope.contactList.length = 0;
            })
                .error(function (response) {
                    console.log("Error in Response: " + response);
                });
        };

        $scope.getStudentList = function (divType) {
            var url = GLOBALS.baseUrl + "user/get-students-list/" + divType['id'] + "?token=" + userSessions.userSession.userToken;
            $http.get(url)
                .success(function (response) {
                    $scope.contactList = response['data']['studentList'];
                    $scope.checkRecipient = false;
                    $scope.divId = divType['id'];
                })
                .error(function (response) {
                    console.log("Error in Response: " + response);
                });
        };

        $ionicModal.fromTemplateUrl('studentHwCntctlist.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.modal = modal;
        })

        $scope.openModal = function () {
            $scope.modal.show();
        }

        $scope.closeModal = function () {
            $scope.modal.hide();
        };

        $scope.$on('$destroy', function () {
            $scope.modal.remove();
        });


        $scope.sendTo = function () {
            $scope.recipient = $scope.selectedList.length + " Student selected";
            $scope.closeModal();
        };

        $scope.saveDraft = function () {
            $ionicLoading.show({
                template: 'Loading...',
            })
            $ionicLoading.show();
            $scope.dueDate = $filter('date')($scope.dueDate, "yyyy-MM-dd");
            $scope.minDate = $filter('date')($scope.minDate, "yyyy-MM-dd");
            if ($scope.dueDate >= $scope.minDate) {
                if ($scope.selectedList.length == 0 || $scope.hwTitle == '' || $scope.dueDate == '' || $scope.description == '' || $scope.hwTypeId == '') {
                    if ($scope.selectedList.length <= 0) {
                        $scope.msg = "Please Add Recipient";
                        $ionicLoading.hide();
                        $scope.showPopup();
                    } else {
                        $scope.msg = "Check if all fields are filled";
                        $ionicLoading.hide();
                        $scope.showPopup();
                    }
                } else {
                    var image = angular.toJson($scope.image);
                    var url = GLOBALS.baseUrl + "user/homework-create?token=" + userSessions.userSession.userToken;
                    $http.post(url, {
                        subject_id: $scope.SubjectId,
                        title: $scope.hwTitle,
                        batch_id: $scope.BatchId,
                        class_id: $scope.classId,
                        division_id: $scope.divId,
                        due_date: $scope.dueDate,
                        description: $scope.description,
                        homework_type: $scope.hwTypeId,
                        student_id: $scope.selectedList,
                        image: $scope.image,
                        file_type: $scope.imageExtention
                    }).success(function (response) {
                        if (response['status'] == 200) {
                            $scope.msg = response['message'];

                            $ionicLoading.hide();
                            if (response['status'] == 200) {
                                console.log("user/homework-create?token=")
                                console.log(response)
                                $scope.msg = response['message'];
                                $scope.showPopup();
                                $state.go('app.edithomeworklisting');
                            }
                            else {
                                // $scope.msg = response['message'];
                                // $ionicLoading.hide();
                                // $scope.showPopup();
                                var myPopup = $ionicPopup.show({
                                    template: '',
                                    title: 'Something Went Wrong!!!',
                                    subTitle: 'Please Try Again...',
                                });
                                $timeout(function () {
                                    myPopup.close();
                                }, 2000);
                            }
                        }
                    })
                        .error(function (response) {
                            console.log("Error in Response: " + response);
                            if (response.hasOwnProperty('status')) {
                                $scope.msg = response.message;
                                console.log($scope.msg)
                            }
                            else {
                                $scope.msg = "Access Denied";
                            }
                            $ionicLoading.hide();
                            $scope.showPopup();
                        });
                }
            } else {
                $scope.msg = "Due Date should be greater than Current Date";
                $ionicLoading.hide();
                $scope.showPopup();

            }
        };
        $scope.selectedAll = false;
        $scope.checkAll = function () {
            $scope.selectedList.length = 0;
            $scope.selectedAll = !$scope.selectedAll;
            if ($scope.selectedAll == true) {
                angular.forEach($scope.contactList, function (item) {
                    $scope.toggleSelection(item.id);
                });
            }

        };

        $scope.showPopup = function () {
            // An elaborate, custom popup
            var myPopup = $ionicPopup.show({
                template: '<div>' + $scope.msg + '</div>',
                title: '',
                subTitle: '',
                scope: $scope
            });
            myPopup.then(function (res) {
                console.log('Tapped!', res);
            });
            $timeout(function () {
                myPopup.close(); //close the popup after 8 seconds for some reason
            }, 3000);
        };

    })

    .controller('MessageCtrl', function ($scope, $state, $timeout, $ionicPopup, ionicMaterialInk, $ionicSideMenuDelegate, GLOBALS, userSessions, $http, chatHist) {

        $scope.$parent.clearFabs();
        $scope.isExpanded = false;
        $scope.$parent.setExpanded(false);
        $scope.$parent.setHeaderFab(false);
        $scope.flag = true;
        // if($scope.flag == true){
        //     document.getElementById('fab-new-message').hide();
        // }
        // Set Header
        $scope.$parent.hideHeader();

        // Set Ink
        ionicMaterialInk.displayEffect();

        //Side-Menu
        if (userSessions.userSession.userToken == 0) {
            $state.go('login');
        }
        $ionicSideMenuDelegate.canDragContent(true);
        userSessions.setMsgCount_0();
        $scope.msgCount = '';
        $scope.fromId = '';
        $scope.tooId = '';
        $scope.nMessages = [];
        $scope.aclMessage = "Access Denied";
        $scope.clickStatus = false;
        $scope.loadMessages = function () {
            if (userSessions.userSession.userRole == "parent") {
                var url1 = GLOBALS.baseUrl + "user/get-messages-parent/" + userSessions.userSession.userId + "?token=" + userSessions.userSession.userToken;
                $http.get(url1).success(function (response) {
                    if (response['status'] == 200) {
                        $scope.nMessages = response['MessageList'];
                        if ($scope.nMessages == '') {
                            $scope.aclMessage = response['message'];
                            $scope.showPopup();
                        }
                    }
                    else {
                        $scope.aclMessage = response['message'];
                        $scope.showPopup();
                    }
                }).error(function (err) {
                    console.log(err);
                    $scope.aclMessage = "Access Denied";
                    $scope.showPopup();
                });
            }
            else {
                var url2 = GLOBALS.baseUrl + "user/get-messages?token=" + userSessions.userSession.userToken;
                $http.get(url2).success(function (response) {
                    if (response['status'] == 200) {
                        $scope.nMessages = response['MessageList'];
                        if ($scope.nMessages == '') {
                            $scope.aclMessage = response['message'];
                            $scope.showPopup();
                        }
                    }
                    else {
                        $scope.aclMessage = response['message'];
                        $scope.showPopup();
                    }
                }).error(function (err) {
                    console.log(err);
                    $scope.aclMessage = "Access Denied";
                    $scope.showPopup();
                });
            }
        };
        $scope.loadMessages();
        $scope.confirmDelete = function (from, to) {
            $scope.fromId = from;
            $scope.tooId = to;
            $scope.showConfirmBox();
        };

        $scope.deleteMessage = function () {
            var url = GLOBALS.baseUrl + "user/delete-messages?token=" + userSessions.userSession.userToken;
            $http.post(url, { _method: 'PUT', from_id: $scope.fromId, to_id: $scope.tooId }).success(function (response) {
                $scope.loadMessages();
            }).error(function (err) {
                console.log(err);
                $scope.aclMessage = "Access Denied";
                $scope.showPopup();
            });
        };
        $scope.msgDetails = function (from, to, title, title_id) {
            var flag = chatHist.setChatHist(userSessions.userSession.userId, from, to, title, title_id);
            if (flag == true) {
                $state.go('app.chatmsg');
            }
        };
        $scope.showConfirmBox = function () {
            // An elaborate, custom popup
            var myPopup = $ionicPopup.show({
                template: '<div class = "row"><span class = "align-center red-font text-center-align">This will delete entire conversation</span></div>',
                title: 'Confirm to Delete',
                subTitle: '',
                scope: $scope,
                buttons: [
                    {
                        text: '<b>Close</b>',
                        type: 'button-calm',
                        onTap: function (e) {
                            myPopup.close();
                        }
                    },
                    {
                        text: '<b>Delete</b>',
                        type: 'button-assertive',
                        onTap: function (e) {
                            $scope.deleteMessage();
                        }
                    }
                ]

            });
            myPopup.then(function (res) {
                console.log('Tapped!', res);
            });
        };

        $scope.showPopup = function () {
            // An elaborate, custom popup
            var msgPopup = $ionicPopup.show({
                template: '<div>' + $scope.aclMessage + '</div>',
                title: '',
                subTitle: '',
                scope: $scope
            });
            msgPopup.then(function (res) {
                console.log('Tapped!', res);
            });
            $timeout(function () {
                msgPopup.close(); //close the popup after 8 seconds for some reason
            }, 3000);
        };
    })

    .controller('MsgComposeCtrl', function ($scope, $state, $timeout, $ionicPopup, ionicMaterialInk, $ionicSideMenuDelegate, $ionicModal, GLOBALS, userSessions, $http) {

        $scope.$parent.clearFabs();
        $scope.isExpanded = false;
        $scope.$parent.setExpanded(false);
        $scope.$parent.setHeaderFab(false);
        // Set Header
        $scope.$parent.hideHeader();

        // Set Ink
        ionicMaterialInk.displayEffect();
        //Side-Menu
        if (userSessions.userSession.userToken == 0) {
            $state.go('login');
        }


        var url = GLOBALS.baseUrl + "user/get-acl-details?token=" + userSessions.userSession.userToken;
        $http.get(url).success(function (response) {
            $scope.data = response['Data']['Acl_Modules'];
            if ($scope.data.indexOf('Create_message') == -1) {
                $scope.msg = "Access Denied";
                $scope.showPopup();
                $state.go('app.message');
            }
        }).error(function (err) {
            console.log(err);
        });


        $ionicSideMenuDelegate.canDragContent(true);
        $scope.checkRole = "displayno";
        $scope.checkRecipient = true;
        $scope.recipient = "Add Recipient+ ";
        $scope.contactList = [];
        $scope.message = "";
        var url1 = GLOBALS.baseUrl + "user/userroles?token=" + userSessions.userSession.userToken;

        $http.get(url1)
            .success(function (response) {
                $scope.userRoles = response['data']['userRoles'];
            })
            .error(function (response) {
                console.log("Error in Response: " + response);
            });
        $scope.getSelectedRole = function (roleType) {
            if (roleType['name'] == "Student") {
                $scope.checkRole = "";
                $scope.recipient = "Add Recipient+ ";
                $scope.checkRecipient = true;
                $scope.contactList.length = 0;
                var url = GLOBALS.baseUrl + "user/get-batches-teacher?token=" + userSessions.userSession.userToken;
                $http.get(url).success(function (response) {
                    $scope.batches = response['data'];
                })
                    .error(function (response) {
                        console.log("Error in Response: " + response);
                    });
            }
            else {
                $scope.checkRecipient = false;
                $scope.checkRole = "displayno";
                $scope.recipient = "Add Recipient+ ";
                $scope.contactList.length = 0;
                $scope.getTeacherList();
            }
        }
        $scope.getClass = function (batchType) {
            var url = GLOBALS.baseUrl + "user/getclasses/" + batchType['id'] + "?token=" + userSessions.userSession.userToken;
            $http.get(url).success(function (response) {
                $scope.classes = response['data']['classList'];
            })
                .error(function (response) {
                    console.log("Error in Response: " + response);
                });
        };

        $scope.getDivision = function (classType) {
            var url = GLOBALS.baseUrl + "user/getdivisions/" + classType['id'] + "?token=" + userSessions.userSession.userToken;
            $http.get(url).success(function (response) {
                $scope.divisions = response['data']['divisionList'];
            })
                .error(function (response) {
                    console.log("Error in Response: " + response);
                });
        };

        $scope.getStudentList = function (divType) {
            $scope.contactList.length = 0;
            var url = GLOBALS.baseUrl + "user/get-students-list/" + divType['id'] + "?token=" + userSessions.userSession.userToken;
            console.log("user/get-students-list/  " + url)
            $http.get(url)
                .success(function (response) {
                    $scope.contactList = response['data']['studentList'];
                })
                .error(function (response) {
                    console.log("Error in Response: " + response);
                });
            $scope.checkRecipient = false;
        };
        $scope.getTeacherList = function () {
            var url = GLOBALS.baseUrl + "user/getteachers/?token=" + userSessions.userSession.userToken;
            $http.get(url)
                .success(function (response) {
                    $scope.contactList = response['data']['teachers'];
                })
                .error(function (response) {
                    console.log("Error in Response: " + response);
                });
        };

        $ionicModal.fromTemplateUrl('studentCntctlist.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.modal = modal;
        })

        $scope.openModal = function () {
            $scope.modal.show();
        }

        $scope.closeModal = function () {
            $scope.modal.hide();
        };

        $scope.$on('$destroy', function () {
            $scope.modal.remove();
        });

        $scope.selectRecipient = function (rname, id) {
            $scope.recipient = rname;
            $scope.recipientId = id;
            $scope.closeModal();
        };

        $scope.setMessage = function (message) {
            $scope.message = message;
        };

        $scope.sendMessage = function () {
            if ($scope.recipient == "Add Recipient+ " || $scope.message == "" || $scope.recipient == "" && $scope.message == "") {
                if ($scope.recipient == "Add Recipient+ ") {
                    $scope.msg = "Please Add Recipient";
                }
                if ($scope.message == "") {
                    $scope.msg = "Cannot send blank message";
                }
                if ($scope.recipient == "Add Recipient+ " && $scope.message == "") {
                    $scope.msg = "Please Add Recipient & Cannot send blank message";
                }
                $scope.showPopup();
            }
            else {
                var url = GLOBALS.baseUrl + "user/send-message?token=" + userSessions.userSession.userToken;
                $http.post(url, { from_id: userSessions.userSession.userId, to_id: $scope.recipientId, description: $scope.message })
                    .success(function (response) {
                        if (response['status'] == 200) {
                            $scope.msg = response['message'];
                            $scope.showPopup();
                            $state.go('app.message');
                        }
                        else {
                            $scope.msg = response['message'];
                            $scope.showPopup();
                        }
                    })
                    .error(function (response) {
                        console.log("Error in Response: " + response);
                        $scope.msg = "Access Denied";
                        $scope.showPopup();
                    });
            }
        };

        $scope.showPopup = function () {
            // An elaborate, custom popup
            var myPopup = $ionicPopup.show({
                template: '<div>' + $scope.msg + '</div>',
                title: '',
                subTitle: '',
                scope: $scope
            });
            myPopup.then(function (res) {
                console.log('Tapped!', res);
            });
            $timeout(function () {
                myPopup.close(); //close the popup after 8 seconds for some reason
            }, 3000);
        };
    })

    .controller('ParentMsgComposeCtrl', function ($rootScope, $scope, $state, $timeout, ionicMaterialInk, $ionicSideMenuDelegate, $ionicModal, $ionicHistory, $http, GLOBALS, userSessions, $ionicPopup) {

        $scope.$parent.clearFabs();
        $scope.isExpanded = false;
        $scope.$parent.setExpanded(false);
        $scope.$parent.setHeaderFab(false);

        // Set Header
        $scope.$parent.hideHeader();

        // Set Ink
        ionicMaterialInk.displayEffect();

        //Side-Menu

        $ionicSideMenuDelegate.canDragContent(true);

        //check if LC is created
        if ($rootScope.lcStatus) {
            $scope.LcStatus = $rootScope.lcStatus
            var alertPopup = $ionicPopup.alert({
                title: 'LC has been generated for this student',
                template: '  For any information please contact the school'
            });
        } else {
            $scope.LcStatus = $rootScope.lcStatus
        }

        var url = GLOBALS.baseUrl + "user/get-acl-details?token=" + userSessions.userSession.userToken;
        $http.get(url).success(function (response) {
            $scope.data = response['Data']['Acl_Modules'];
            if ($scope.data.indexOf('Create_message') == -1) {
                $scope.msg = "Access Denied";
                $scope.showPopup();
            }
        }).error(function (err) {
            console.log(err);
        });

        $scope.recipient = "";
        $scope.message = "";
        $scope.contactList = [];
        if (userSessions.userSession.userToken == 0) {
            $state.go('login');
        }

        var url = GLOBALS.baseUrl + "user/get-teachers-list/" + userSessions.userSession.userId + "/?token=" + userSessions.userSession.userToken;
        $http.get(url)
            .success(function (response) {
                $scope.contactList = response['data']['teachersList'];
            })
            .error(function (response) {
                console.log("Error in Response: " + response);
            });

        $ionicModal.fromTemplateUrl('teacherCntctlist.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.modal = modal;
        })

        $scope.openModal = function () {
            $scope.modal.show();
        }

        $scope.closeModal = function () {
            $scope.modal.hide();
        };

        $scope.$on('$destroy', function () {
            $scope.modal.remove();
        });

        $scope.selectRecipient = function (rname, id) {
            $scope.recipient = rname;
            $scope.recipientId = id;
            $scope.closeModal();
        };


        $scope.setMessage = function (message) {

            $scope.message = message;
        };

        $scope.sendMessage = function () {
            if ($scope.recipient == "" || $scope.message == "" || $scope.recipient == "" && $scope.message == "") {
                if ($scope.recipient == "") {
                    $scope.msg = "Please Add Recipient";
                }
                if ($scope.message == "") {
                    $scope.msg = "Cannot send blank message";
                }
                if ($scope.recipient == "" && $scope.message == "") {
                    $scope.msg = "Please Add Recipient & Cannot send blank message";
                }
                $scope.showPopup();
            }
            else {
                var url = GLOBALS.baseUrl + "user/send-message?token=" + userSessions.userSession.userToken;
                $http.post(url, { from_id: userSessions.userSession.userId, to_id: $scope.recipientId, description: $scope.message })
                    .success(function (response) {
                        if (response['status'] == 200) {
                            $scope.msg = response['message'];
                            $scope.showPopup();
                            $state.go('app.message');
                        }
                        else {
                            $scope.msg = response['message'];
                            $scope.showPopup();
                        }
                    })
                    .error(function (response) {
                        console.log("Error in Response: " + response);
                        $scope.msg = "Access Denied";
                        $scope.showPopup();
                    });
            }
        };

        $scope.showPopup = function () {
            // An elaborate, custom popup
            var myPopup = $ionicPopup.show({
                template: '<div>' + $scope.msg + '</div>',
                title: '',
                subTitle: '',
                scope: $scope
            });
            myPopup.then(function (res) {
                console.log('Tapped!', res);
            });
            $timeout(function () {
                myPopup.close(); //close the popup after 8 seconds for some reason
            }, 3000);
        };
    })

    .controller('MsgChatCtrl', function ($scope, $state, $timeout, ionicMaterialInk, $ionicScrollDelegate, $ionicPopup, $ionicSideMenuDelegate, GLOBALS, chatHist, $http, userSessions) {
        $scope.$parent.clearFabs();
        $scope.isExpanded = false;
        $scope.$parent.setExpanded(false);
        $scope.$parent.setHeaderFab(false);

        // Set Header
        $scope.$parent.hideHeader();

        // Set Ink
        ionicMaterialInk.displayEffect();
        if (userSessions.userSession.userToken == 0) {
            $state.go('login');
        }
        //Side-Menu
        $ionicSideMenuDelegate.canDragContent(true);
        $scope.message = "";
        $scope.envelop = chatHist.getChatHist();
        $scope.messageList = [];
        $scope.loadChat = function () {
            var url = GLOBALS.baseUrl + "user/get-detail-message?token=" + userSessions.userSession.userToken;
            $http.post(url, { user_id: $scope.envelop.user_id, from_id: $scope.envelop.from_id, to_id: $scope.envelop.to_id }).success(function (response) {
                $scope.messageList = response['data'];
                $ionicScrollDelegate.scrollBottom();
            }).error(function (err) {
                console.log(err);
            });
        };
        $scope.loadChat();
        $scope.title = $scope.envelop.title;

        $scope.sendMessage = function () {
            if ($scope.message == "") {
                $scope.msg = "Cannot send blank message";
                $scope.showPopup();
            }
            else {
                var url = GLOBALS.baseUrl + "user/send-message?token=" + userSessions.userSession.userToken;
                $http.post(url, { from_id: $scope.envelop.user_id, to_id: $scope.envelop.title_id, description: $scope.message })
                    .success(function (response) {
                        if (response['status'] == 200) {
                            $scope.msg = response['message'];
                            $scope.loadChat();
                            $scope.message = "";
                        }
                        else {
                            $scope.msg = response['message'];
                            $scope.showPopup();
                        }
                    })
                    .error(function (response) {
                        console.log("Error in Response: " + response);
                        $scope.msg = "Access Denied";
                        $scope.showPopup();
                    });
            }
        };
        $scope.showPopup = function () {
            // An elaborate, custom popup
            var myPopup = $ionicPopup.show({
                template: '<div>' + $scope.msg + '</div>',
                title: '',
                subTitle: '',
                scope: $scope
            });
            myPopup.then(function (res) {
                console.log('Tapped!', res);
            });
            $timeout(function () {
                myPopup.close(); //close the popup after 8 seconds for some reason
            }, 3000);
        };
    })

    .controller('AttendLandingCtrl', function ($scope, $state, $timeout, ionicMaterialInk, $ionicSideMenuDelegate) {

        $scope.$parent.clearFabs();
        $scope.isExpanded = false;
        $scope.$parent.setExpanded(false);
        $scope.$parent.setHeaderFab(false);

        // Set Header
        $scope.$parent.hideHeader();

        // Set Ink
        ionicMaterialInk.displayEffect();

        //Side-Menu

        $ionicSideMenuDelegate.canDragContent(true);

        $scope.recentEvent = function (hwId) {
            var url = GLOBALS.baseUrl + "user/publish-homework?token=" + userSessions.userSession.userToken;
            $http.post(url, { _method: 'PUT', homework_id: hwId }).success(function (response) {
                $scope.errorMessage = response['message'];
                $scope.showPopup();
                $scope.loadUnpHw();
            }).error(function (err) {
                console.log(err);
                $scope.aclMessage = "Access Denied";
                $scope.showPopup();
            });
        };
    })

    .controller('MarkAttendanceCtrl', function ($ionicLoading, $ionicHistory, $scope, $state, $timeout, $http, $ionicPopup, userSessions, GLOBALS, $filter, ionicMaterialInk, $log, $ionicSideMenuDelegate) {
        $scope.$parent.clearFabs();
        $scope.isExpanded = false;
        $scope.$parent.setExpanded(false);
        $scope.$parent.setHeaderFab(false);
        // Set Header
        $scope.$parent.hideHeader();
        // Set Ink
        ionicMaterialInk.displayEffect();
        //Side-Menu
        $ionicSideMenuDelegate.canDragContent(true);
        $scope.gotIt = 0;
        $scope.absentList = [];
        $scope.currentDate = new Date();
        $scope.currentBatch = '';
        $scope.currentClass = '';
        $scope.currentDiv = '';
        $scope.goback = function () {
            $ionicHistory.goBack();
        }
        $scope.getStudentList = function () {
            $scope.setDate = $filter('date')($scope.currentDate, "yyyy-MM-dd");
            var url = GLOBALS.baseUrl + "user/students-list?token=" + userSessions.userSession.userToken;
            $ionicLoading.show();
            $http.post(url, {
                date: $scope.setDate,
                teacher_id: userSessions.userSession.userId
            }).success(function (response) {
                $ionicLoading.hide();
                if (response['status'] == 200) {
                    console.log(response)
                    $scope.studentList = response['data']['studentList'];
                    $scope.absentList = response['data']['absentList'];
                    $scope.currentBatch = response['data']['batchName'];
                    $scope.currentClass = response['data']['className'];
                    $scope.currentDiv = response['data']['divisionName'];
                }
                else {
                    $scope.msg = response['message'];
                    $scope.showPopup();
                }
            })
                .error(function (response) {
                    console.log("Error in Response: " + response.toString());
                    if (response.hasOwnProperty('status')) {
                        $scope.msg = response.message;
                        $scope.showPopup();
                    }
                    else {
                        $scope.msg = "Access Denied";
                        $scope.showPopup();
                        $state.go('app.attendancelanding');
                    }
                });
        }
        $scope.getStudentList();

        $scope.toggleCheck = function (elementData, studentId) {
            var idx = $scope.absentList.indexOf(studentId);
            if (idx > -1) {
                $scope.absentList.splice(idx, 1);
            }
            // is newly selected
            else {
                $scope.absentList.push(studentId);
            }
            var changeClass = angular.element(document.querySelector('#' + elementData.target.id));

            if (elementData.target.classList[2] == "mark-0" || elementData.target.classList[1] == "mark-0" || elementData.target.classList[3] == "mark-0" || elementData.target.classList[0] == "mark-0") {
                changeClass.removeClass('mark-0');
                changeClass.addClass('mark-1');
            }
            else {
                changeClass.removeClass('mark-1');
                changeClass.addClass('mark-0');
            }
        };
        $scope.markAttendance = function () {
            $scope.setDate = $filter('date')($scope.currentDate, "yyyy-MM-dd");
            var url = GLOBALS.baseUrl + "user/mark-attendance?token=" + userSessions.userSession.userToken;
            console.log($scope.absentList);
            $ionicLoading.show();
            $http.post(url, { date: $scope.setDate, student_id: $scope.absentList }).success(function (response) {
                console.log(response);
                $ionicLoading.hide();
                if (response['status'] == 200) {
                    $scope.msg = response['message'];
                    $scope.showPopup();
                }
                else {
                    $scope.msg = response['message'];
                    $scope.showPopup();
                }
            })
                .error(function (response) {
                    console.log(response);
                    $scope.msg = "Access Denied";
                    $scope.showPopup();
                });
        }
        $scope.showPopup = function () {
            // An elaborate, custom popup
            var myPopup = $ionicPopup.show({
                template: '<div>' + $scope.msg + '</div>',
                title: '',
                subTitle: '',
                scope: $scope
            });
            myPopup.then(function (res) {
                console.log('Tapped!', res);
            });
            $timeout(function () {
                myPopup.close(); //close the popup after 8 seconds for some reason
            }, 3000);
        };
    })

    .controller('ViewAttendanceCtrl', function ($scope, $state, GLOBALS, $ionicPopup, $filter, $timeout, userSessions, $http, ionicMaterialInk, $ionicSideMenuDelegate) {
        $scope.$parent.clearFabs();
        $scope.isExpanded = false;
        $scope.$parent.setExpanded(false);
        $scope.$parent.setHeaderFab(false);
        // Set Header
        $scope.$parent.hideHeader();
        // Set Ink
        ionicMaterialInk.displayEffect();
        //Side-Menu
        $ionicSideMenuDelegate.canDragContent(true);
        $scope.events = [];
        $scope.batchName = 'Batch';
        $scope.className = 'Class';
        $scope.divisionName = 'Div';
        $scope.divisionId = '';
        $scope.selectedDateData = [];
        $scope.selectedDateMessage = '';
        $scope.userRole = userSessions.userSession.userRole;
        $scope.userId = userSessions.userSession.userId;
        $scope.getSelectedDateData = function (selectedDate) {
            $scope.selectedDate = $filter('date')(selectedDate, "yyyy-MM-dd");
            var url = null;
            if (userSessions.userSession.userRole == 'parent') {
                url = GLOBALS.baseUrl + "user/view-attendance-parent?token=" + userSessions.userSession.userToken;
                $http.post(url, { student_id: $scope.userId, date: $scope.selectedDate })
                    .success(function (response) {
                        if (response['status'] == 200) {
                            $scope.selectedDateData = response['data'];
                            $scope.selectedDateMessage = response['message'];
                        }
                        else {
                            $scope.msg = response['message'];
                            $scope.showPopup();
                        }
                    })
                    .error(function (response) {
                        console.log("Error in Response: " + response);
                        if (response.hasOwnProperty('status')) {
                            $scope.msg = response.message;
                            $scope.selectedDateData.length = 0;
                        }
                        else {
                            $scope.msg = "Access Denied";

                            $scope.selectedDateData.length = 0;

                        }
                        $scope.showPopup();
                    });
            }
            else {
                $scope.selectedDate = $filter('date')(selectedDate, "yyyy-MM-dd");
                url = GLOBALS.baseUrl + "user/view-attendance-teacher?token=" + userSessions.userSession.userToken;
                $http.post(url, { division_id: $scope.divisionId, date: $scope.selectedDate })
                    .success(function (response) {
                        if (response['status'] == 200) {
                            $scope.selectedDateData = response['data'];
                        } else {
                            $scope.msg = response['message'];
                            $scope.showPopup();
                        }
                    })
                    .error(function (response) {
                        console.log("Error in Response: " + response);
                        if (response.hasOwnProperty('status')) {
                            $scope.msg = response.message;
                            $scope.selectedDateData.length = 0;
                        }
                        else {
                            $scope.msg = "Select Batch,Division & class.";
                            $scope.selectedDateData.length = 0;
                        }
                        $scope.showPopup();
                    });
            }
        };
        if (userSessions.userSession.userRole == 'teacher') {
            var url = GLOBALS.baseUrl + "user/attendance-batches?token=" + userSessions.userSession.userToken;
            $http.get(url).success(function (batches) {
                $scope.batches = batches;
            })
                .error(function (response) {
                    console.log("Error in Response: " + response);
                });
        } else {
            $scope.currentDate = new Date();
            $scope.getSelectedDateData($scope.currentDate);
        }
        $scope.getClass = function (batch) {
            var url = GLOBALS.baseUrl + "user/attendance-classes/" + batch + "?token=" + userSessions.userSession.userToken;
            $http.get(url).success(function (classes) {
                $scope.classes = classes;
            })
                .error(function (response) {
                    console.log("Error in Response: " + response);
                });
        };
        $scope.getDivision = function (classType) {
            var url = GLOBALS.baseUrl + "user/get-attendance-divisions/" + classType + "?token=" + userSessions.userSession.userToken;
            $http.get(url).success(function (Division) {
                $scope.divisions = Division;
            })
                .error(function (response) {
                    console.log("Error in Response: " + response);
                });
        };
        $scope.getAttendanceList = function (id) {
            var url = null;
            if (userSessions.userSession.userRole == 'parent') {
                url = GLOBALS.baseUrl + "user/default-attendance-parent/" + id + "?token=" + userSessions.userSession.userToken;
            }
            else {
                $scope.divisionId = id;
                url = GLOBALS.baseUrl + "user/attendance-teacher/" + id + "?token=" + userSessions.userSession.userToken;
            }
            $http.get(url).success(function (response) {
                $scope.events = response['data'];
            })
                .error(function (response) {
                    console.log("Error in Response: " + response);
                });
        };
        if (userSessions.userSession.userRole == 'teacher') {
            url = GLOBALS.baseUrl + "user/default-attendance-teacher/?token=" + userSessions.userSession.userToken;
            $http.get(url).success(function (response) {
                $scope.events = response['data']['absentDates'];
                $scope.batchId = response['data']['batchId'];
                $scope.batchName = response['data']['batchName'];
                $scope.classId = response['data']['classId'];
                $scope.className = response['data']['className'];
                $scope.divisionId = response['data']['divId'];
                $scope.divName = response['data']['divName'];
                $scope.getClass($scope.batchId);
                $scope.getDivision($scope.classId);
            })
                .error(function (response) {
                    console.log("Error in Response: " + response);
                    $scope.msg = "Access Denied";
                    $scope.showPopup();
                    $state.go('app.attendancelanding');
                });
        }
        $scope.options = {
            defaultDate: new Date(),
            minDate: "",
            maxDate: "",
            disabledDates: [],
            dayNamesLength: 3, // 1 for "M", 2 for "Mo", 3 for "Mon"; 9 will show full day names. Default is 1.
            mondayIsFirstDay: true,//set monday as first day of week. Default is false
            eventClick: function (date) {
                $scope.selectedDate = $filter('date')(date['date'], "yyyy-MM-dd");
                $scope.getSelectedDateData($scope.selectedDate);
                console.log(date['event']);
            },
            dateClick: function (date) {
                console.log(date['event']);
                $scope.selectedDate = $filter('date')(date['date'], "yyyy-MM-dd");
                $scope.getSelectedDateData($scope.selectedDate);
            },
            changeMonth: function (month, year) {
                console.log(month, year);
            },
            filteredEventsChange: function (filteredEvents) {
                console.log(filteredEvents);
            }
        };
        if ($scope.userRole == 'parent') {
            $scope.getAttendanceList($scope.userId);
        }
        $scope.showPopup = function () {
            // An elaborate, custom popup
            var myPopup = $ionicPopup.show({
                template: '<div>' + $scope.msg + '</div>',
                title: '',
                subTitle: '',
                scope: $scope
            });
            myPopup.then(function (res) {
                console.log('Tapped!', res);
            });
            $timeout(function () {
                myPopup.close(); //close the popup after 8 seconds for some reason
            }, 3000);
        };
    })

    .controller('LandingEventTeacherCtrl', function ($ionicLoading, $scope, $state, $timeout, GLOBALS, userSessions, $ionicPopup, $http, ionicMaterialInk, $ionicSideMenuDelegate, $ionicModal) {
        $scope.$on("$ionicView.beforeEnter", function (event, data) {
            // handle event$scope.show = function() {
            $ionicLoading.show({
                template: 'Loading...',
                duration: 1500
            })
            $scope.showAlert = function () {
                var alertPopup = $ionicPopup.alert({
                    title: 'Under construction!',
                    template: 'We are working on that.'
                });
            }
            $scope.hide = function () {
                $ionicLoading.hide().then(function () {
                });
            }
        });
        $scope.hidden = true;
        $scope.hiddenn = true;
        $scope.$parent.clearFabs();
        $scope.isExpanded = false;
        $scope.$parent.setExpanded(false);
        $scope.$parent.setHeaderFab(false);
        // Set Header
        $scope.$parent.hideHeader();
        // Set Ink
        ionicMaterialInk.displayEffect();
        //Side-Menu
        $ionicSideMenuDelegate.canDragContent(true);

        $scope.eventList = null;
        $scope.recentEvent = function () {
            var url = GLOBALS.baseUrl + "user/view-top-five-event/?token=" + userSessions.userSession.userToken;
            $http.get(url).success(function (response) {
                if (response['status'] == 200) {
                    $scope.eventList = response['data'];
                    if ($scope.eventList == '') {
                        $scope.aclMessage = response['message'];
                        $scope.showPopup();
                    }
                } else {
                    $scope.aclMessage = response['message'];
                    $scope.showPopup();
                }
            }).error(function (err) {
                $scope.aclMessage = "Access Denied";
                $scope.showPopup();
            });
        }
        $scope.selectedYear = null;
        $scope.yearMonthData = null;
        $scope.monthList = null;
        $scope.eventYearMonth = function () {
            var url = GLOBALS.baseUrl + "user/get-year-month?token=" + userSessions.userSession.userToken;
            $http.get(url).success(function (response) {
                if (response['status'] == 200) {
                    $scope.yearMonthData = response['data'];
                    if ($scope.yearMonthData == '') {
                        $scope.aclMessage = response['message'];
                        $scope.showPopup();
                    }
                } else {
                    $scope.aclMessage = response['message'];
                    $scope.showPopup();
                }
            }).error(function (err) {
                $scope.aclMessage = "Data not found for this Instance!!!";
                $scope.showPopup();
            });
        }
        $scope.eventYearMonth();
        $scope.setMonth = function (year) {
            $scope.monthList = null;
            angular.forEach($scope.yearMonthData, function (item) {
                if (item.year === year) {
                    $scope.monthList = item.month[0];
                }
            });
        }
        $scope.setMonth($scope.selectedYear);
        $scope.eventByMonth = function (month) {
            var url = GLOBALS.baseUrl + "user/view-months-event/" + $scope.selectedYear + "/" + month + "/?token=" + userSessions.userSession.userToken;
            $http.get(url).success(function (response) {
                if (response['status'] == 200) {
                    console.log(response['data']);
                    $scope.eventList = response['data'];
                    console.log($scope.eventList);
                    if ($scope.eventList == '') {
                        $scope.aclMessage = response['message'];
                        $scope.showPopup();
                    }
                } else {
                    $scope.aclMessage = response['message'];
                    $scope.showPopup();
                }
            }).error(function (err) {
                $scope.aclMessage = "Event Not Found For This Instance!!!";
                $scope.showPopup();
            });
        }
        $scope.getDetailsOfEvent = function (event_id) {
            var keepGoing = true;
            angular.forEach($scope.eventList, function (item) {
                if (keepGoing) {
                    if (item.id === event_id) {
                        $state.go('app.eventstatusteacher', { obj: item });
                        keepGoing = false;
                    }
                }
            });
        }
        $scope.showPopup = function () {
            // An elaborate, custom popup
            var myPopup = $ionicPopup.show({
                template: '<div>' + $scope.aclMessage + '</div>',
                title: '',
                subTitle: '',
                scope: $scope
            });
            myPopup.then(function (res) {
                console.log('Tapped!', res);
            });
            $timeout(function () {
                myPopup.close(); //close the popup after 3 seconds for some reason
            }, 3000);
        };
        $scope.recentEvent();
    })
    // .controller('app.PublicNoticeboard', function ($ionicHistory, $rootScope, userSessions, GLOBALS, $http, $scope, $state, $timeout, ionicMaterialInk, $ionicSideMenuDelegate, $ionicLoading) {

    .controller('app.PublicAchievementCtrl', function ($ionicHistory, $rootScope, userSessions, GLOBALS, $http, $scope, $state, $timeout, ionicMaterialInk, $ionicSideMenuDelegate, $ionicLoading) {
        $scope.myGoBack = function () {
            $state.go('publicDashboard')
        };
        $scope.$parent.clearFabs();
        $scope.isExpanded = false;
        $scope.$parent.setExpanded(false);
        $scope.$parent.setHeaderFab(false);
        // Set Header
        $scope.$parent.hideHeader();
        // Set Ink
        ionicMaterialInk.displayEffect();
        //Side-Menu
        $ionicSideMenuDelegate.canDragContent(false);

        $ionicLoading.show({
            template: 'Loading...',
        })
        $ionicLoading.show();
        $scope.achievementDetail = function (id) {
            $rootScope.DetailAchievemtns = [];
            angular.forEach($scope.nmessages, function (data) {
                if (data.id == id) {
                    $rootScope.DetailAchievemtns.push(data);
                }
            })
            $rootScope.imagesData = [];
            angular.forEach($scope.imageData, function (dataa) {
                angular.forEach(dataa, function (dataImage) {
                    if (dataImage.event_id == id) {
                        $rootScope.imagesData.push(dataImage);
                    }
                })
            })
            $state.go('app.achievementdetailspublic');
        };
        var url = GLOBALS.baseUrl + "user/view-achievement-parent";
        $http.post(url, { body_id: $rootScope.organisationID, _method: 'POST' })
            .success(function (response) {
                if (response['status'] == 200) {
                    $ionicLoading.hide();
                    $scope.nmessages = response['data'];
                } else {
                    $scope.responseMessage = response['message'];
                    $scope.showPopup();
                }
            }).error(function (err) {
                $scope.responseMessage = "You do not have permission,please contact admin!!!";
                $scope.showPopup();
            });
        $scope.checkAll = function () {
            if ($scope.selectedAll) {
                $scope.selectedAll = true;
            } else {
                $scope.selectedAll = false;
            }
            angular.forEach($scope.nmessages, function (nmsg) {
                nmsg.Selected = $scope.selectedAll;
            });
        };
    })

    .controller('PublicEventCtr', function ($rootScope, $ionicHistory, $ionicLoading, $scope, $state, $timeout, GLOBALS, userSessions, $ionicPopup, $http, ionicMaterialInk, $ionicSideMenuDelegate, $ionicModal) {
        $scope.hidden = true;
        $scope.hiddenn = true;
        $scope.myGoBack = function () {
            $state.go('publicDashboard')
        };
        $scope.recentEvent = function () {
            var url = GLOBALS.baseUrl + "user/view-top-five-event-new";
            $http.post(url, { body_id: $rootScope.organisationID, _method: 'POST' })
                .success(function (response) {
                    if (response['status'] == 200) {
                        $scope.eventList = response['data'];
                    } else {
                        $scope.responseMessage = response['message'];
                        $scope.showPopup();
                    }
                }).error(function (err) {
                    $scope.responseMessage = "You do not have permission,please contact admin!!!";
                    $scope.showPopup();
                });
        }

        $scope.eventYearMonth = function () {
            var url = GLOBALS.baseUrl + "user/public-get-year-month";
            $http.get(url).success(function (response) {
                if (response['status'] == 200) {
                    $scope.yearMonthData = response['data'];
                    if ($scope.yearMonthData == '') {
                        $scope.aclMessage = response['message'];
                        $scope.showPopup();
                    }
                } else {
                    $scope.aclMessage = response['message'];
                    $scope.showPopup();
                }
            }).error(function (err) {
                $scope.aclMessage = "Data not found for this Instance!!!";
                $scope.showPopup();
            });
        }
        $scope.eventYearMonth();
        $scope.setMonth = function (year) {
            $scope.monthList = null;
            angular.forEach($scope.yearMonthData, function (item) {
                if (item.year === year) {
                    $scope.monthList = item.month[0];
                }
            });
        }
        $scope.setMonth($scope.selectedYear);
        $scope.eventByMonth = function (month) {
            var url = GLOBALS.baseUrl + "user/view-months-event/" + $scope.selectedYear + "/" + month;
            $http.get(url).success(function (response) {
                if (response['status'] == 200) {
                    console.log(response['data']);
                    $scope.eventList = response['data'];
                    console.log($scope.eventList);
                    if ($scope.eventList == '') {
                        $scope.aclMessage = response['message'];
                        $scope.showPopup();
                    }
                } else {
                    $scope.aclMessage = response['message'];
                    $scope.showPopup();
                }
            }).error(function (err) {
                $scope.aclMessage = "Event Not Found For This Instance!!!";
                $scope.showPopup();
            });
        }
        $scope.getDetailsOfEvent = function (event_id) {
            var keepGoing = true;
            angular.forEach($scope.eventList, function (item) {
                if (keepGoing) {
                    if (item.id === event_id) {
                        $state.go('app.eventstatuspublic', { obj: item });
                        keepGoing = false;
                    }
                }
            });
        }
        $scope.showPopup = function () {
            // An elaborate, custom popup
            var myPopup = $ionicPopup.show({
                template: '<div>' + $scope.aclMessage + '</div>',
                title: '',
                subTitle: '',
                scope: $scope
            });
            myPopup.then(function (res) {
                console.log('Tapped!', res);
            });
            $timeout(function () {
                myPopup.close(); //close the popup after 3 seconds for some reason
            }, 3000);
        };
        $scope.recentEvent();
    })

    .controller('FeeDetailCntrl', function ($stateParams, $rootScope, $ionicLoading, $scope, $state, $timeout, GLOBALS, userSessions, $ionicPopup, $http, ionicMaterialInk, $ionicSideMenuDelegate) {
        $scope.getPerticulars = function (installment_id) {
            var id = installment_id;
            var url = GLOBALS.baseUrl + "/user/student-fee-installment/" + id + "/" + userSessions.userSession.userId + "/?token=" + userSessions.userSession.userToken;
            $http.get(url).success(function (response) {
                if (response['status'] == 200) {
                    $ionicLoading.hide();
                    $scope.feeDetails = response['data'];
                    $ionicLoading.hide();
                }
            }).error(function (err) {
                $ionicLoading.hide();
            });
        }
        $scope.getPerticulars($stateParams.installment_id);
    })

    .controller('FeeLandingParentCntrl', function ($cordovaFileTransfer, $ionicScrollDelegate, $rootScope, $ionicLoading, $scope, $state, $timeout, GLOBALS, userSessions, $ionicPopup, $http, ionicMaterialInk, $ionicSideMenuDelegate) {
        $scope.LcStatus = $rootScope.lcStatus;
        var permissions = cordova.plugins.permissions;

        $scope.checkStoragePermissionAndDownload = function (feeId, transactionId) {
            permissions.checkPermission(permissions.READ_EXTERNAL_STORAGE, function (status) {
                if (status.checkPermission) {
                    $scope.downloadFeeReceipt(feeId, transactionId);
                }
                else {
                    permissions.requestPermission(permissions.WRITE_EXTERNAL_STORAGE, success, error);
                    function error() {
                        alert("App dosen't have storage permission");
                    }

                    function success(status) {
                        if (!status.hasPermission) error();
                        console.log("Permission Granted")
                        $scope.downloadFeeReceipt(feeId, transactionId);
                    }
                }
            });
        }
        $scope.$on("$ionicView.beforeEnter", function (event, data) {
            $ionicLoading.show({
                template: 'Loading...',
            })
            $scope.showAlert = function () {
                var alertPopup = $ionicPopup.alert({
                    title: 'Under construction!',
                    template: 'We are working on that.'
                });
            }
            $scope.hide = function () {
                $ionicLoading.hide().then(function () {
                    console.log("The loading indicator is now hidden");
                });
            }
        });

        $scope.openWebView = function (bodyId) {
            console.log("about to open webview")
            var paymentLink;
            if(bodyId == 1) {
                paymentLink = 'http://sspss.veza.co.in/fees/billing-page/';
            } else if (bodyId == 2) {
                paymentLink = 'http://sspss.veza.co.in/fees/billing-page/gems';
            }
            window.open(paymentLink, '_blank', 'location=no');
            return true;
        }
        $scope.bodyId = userSessions.userSession.bodyId;
        $scope.detail = function (id) {
            $state.go('app.feeDetail', { installment_id: id });
        }
        $ionicLoading.show({
            template: 'Loading...',
        })
        if (userSessions.userSession.userRole == "teacher") {
            $scope.show = "showw";
            $scope.abc = "100%";
            $ionicLoading.show();
            var url = GLOBALS.baseUrl + "user/get-batches-teacher?" + "token=" + userSessions.userSession.userToken;
            $http.get(url).success(function (response) {
                if (response['status'] == 200) {
                    $ionicLoading.hide();
                    $scope.TeacherBatch = response['data'];
                    if ($scope.TeacherBatch == '') {
                        $ionicLoading.hide();
                        $scope.aclMessage = res['message'];
                    }
                } else {
                    $scope.aclMessage = response['message'];
                }
            }).error(function (err) {
                $scope.aclMessage = "Batch Not Found !!";
            });
        } else {
            //Parent View
            $scope.getFeesStudent = function () {
                $ionicLoading.show();
                var url = GLOBALS.baseUrl + "user/get-fee/" + userSessions.userSession.userId + "/?token=" + userSessions.userSession.userToken;
                
                $http.get(url).success(function (response) {
                    $ionicLoading.hide();   
                    $scope.studentFee = response.data;
                }).error(function (err) {
                    $ionicLoading.hide();
                    $scope.aclMessage = "Installment Not Found !!";
                });
                $scope.show = "show";
                $scope.abc = "50%";
            }
            $scope.downloadFeeReceipt = function(feeId, transactionId) {
            var url = GLOBALS.baseUrl + "user/download-pdf/" + userSessions.userSession.userId + "/" + feeId + "/" + transactionId + "?token=" + userSessions.userSession.userToken;
            var filename = "FeeReceipt-"+transactionId +".pdf";
            var targetPath = cordova.file.externalRootDirectory + "/Download/SSPShikshanSanstha/FeeReceipts/" + filename;
            $cordovaFileTransfer.download(url, targetPath, {}, true).then(function (result) {
                console.log('Success');
                $scope.hasil = 'Save file on ' + targetPath + ' success!';
                $scope.mywallpaper = targetPath;
                alert('Your download is completed \n File is downloaded at Download/SSPShikshanSanstha/FeeReceipts/');
            }, function (error) {
                console.log('Error downloading file');
                $scope.hasil = 'Error downloading file...';
                alert('Your download has failed');
                console.log(error)
            }, function (progress) {
                console.log('progress');
                $scope.downloadProgress = (progress.loaded / progress.total) * 100;
                // var downcountString = $scope.downloadProgress.toFixed();
                // console.log('downcountString');
                // $scope.downloadCount = downcountString;
            });
            }
            $scope.getFees = function () {
                $ionicLoading.show();
                var url = GLOBALS.baseUrl + "user/get-fee_details/" + userSessions.userSession.userId + "/?token=" + userSessions.userSession.userToken;
                $http.get(url).success(function (response) {
                    if (response['status'] == 200) {
                        console.log(response)
                        $scope.myFees = response.data.structures;
                        $scope.transactions = response.data.transaction;
                    }
                }).error(function (err) {
                    $ionicLoading.hide();
                    $scope.aclMessage = "Installment Not Found !!";
                });
                $scope.show = "show";
                $scope.abc = "50%";
            }
            $scope.getFeesStudent();
            $scope.getFees();
            $scope.color = "underline";
            $scope.clickOn = "con1";
            $scope.side = "left";
            $scope.bold1 = "bold";
        }
        $scope.showCon = function (con) {
            $scope.clickOn = con;
            if (con == "con1") {
                $ionicScrollDelegate.scrollTop();
                $scope.color = "underline";
                $scope.color1 = "";
                $scope.side = "left";
                $scope.bold1 = "bold";
                $scope.bold2 = "";
            }
            else {
                $ionicScrollDelegate.scrollTop();
                $scope.color1 = "underline";
                $scope.color = "";
                $scope.side = "right";
                $scope.bold2 = "bold";
                $scope.bold1 = "";
            }
        }
    })

    .controller('LandingEventParentCtrl', function ($ionicLoading, $scope, $state, $timeout, GLOBALS, userSessions, $ionicPopup, $http, ionicMaterialInk, $ionicSideMenuDelegate) {
        $scope.$on("$ionicView.beforeEnter", function (event, data) {


            $ionicLoading.show({
                template: 'Loading...',
                duration: 1500
            })

            $scope.showAlert = function () {
                var alertPopup = $ionicPopup.alert({
                    title: 'Under construction!',
                    template: 'We are working on that.'
                });
            }

            $scope.hide = function () {
                $ionicLoading.hide().then(function () {
                    console.log("The loading indicator is now hidden");
                });
            }
        });

        $scope.$parent.clearFabs();
        $scope.isExpanded = false;
        $scope.$parent.setExpanded(false);
        $scope.$parent.setHeaderFab(false);

        // Set Header
        $scope.$parent.hideHeader();

        // Set Ink
        ionicMaterialInk.displayEffect();

        //Side-Menu

        $ionicSideMenuDelegate.canDragContent(true);

        $scope.noticeBoard = function () {
            $state.go('app.sharedNotification');
        };
        $scope.eventList = null;
        $scope.recentEvent = function () {
            var url = GLOBALS.baseUrl + "user/view-top-five-event/?token=" + userSessions.userSession.userToken;
            $http.get(url).success(function (response) {
                console.log(response);
                if (response['status'] == 200) {
                    $scope.eventList = response['data'];
                    if ($scope.eventList == '') {
                        $scope.aclMessage = response['message'];
                        $scope.showPopup();
                    }
                } else {
                    $scope.aclMessage = response['message'];
                    $scope.showPopup();
                }
            }).error(function (err) {
                $scope.aclMessage = "Access Denied";
                $scope.showPopup();
            });
        }
        $scope.selectedYear = null;
        $scope.yearMonthData = null;
        $scope.monthList = null;

        $scope.eventYearMonth = function () {
            var url = GLOBALS.baseUrl + "user/get-year-month?token=" + userSessions.userSession.userToken;
            $http.get(url).success(function (response) {
                if (response['status'] == 200) {
                    $scope.yearMonthData = response['data'];
                    if ($scope.yearMonthData == '') {
                        $scope.aclMessage = response['message'];
                        $scope.showPopup();
                    }
                } else {
                    $scope.aclMessage = response['message'];
                    $scope.showPopup();
                }
            }).error(function (err) {
                $scope.aclMessage = "Data not found for this instance!!!";
                $scope.showPopup();
            });
        }
        $scope.eventYearMonth();

        $scope.setMonth = function (year) {
            $scope.monthList = null;
            angular.forEach($scope.yearMonthData, function (item) {
                if (item.year === year) {
                    $scope.monthList = item.month[0];
                }
            });
        }

        $scope.setMonth($scope.selectedYear);

        $scope.eventByMonth = function (month) {
            var url = GLOBALS.baseUrl + "user/view-months-event/" + $scope.selectedYear + "/" + month + "/?token=" + userSessions.userSession.userToken;
            $http.get(url).success(function (response) {
                if (response['status'] == 200) {
                    $scope.eventList = response['data'];
                    if ($scope.eventList == '') {
                        $scope.aclMessage = response['message'];
                        $scope.showPopup();
                    }
                } else {
                    $scope.aclMessage = response['message'];
                    $scope.showPopup();
                }
            }).error(function (err) {
                $scope.aclMessage = "Data not found for this instance!!!";
                $scope.showPopup();
            });
        }

        $scope.getDetailsOfEvent = function (event_id) {
            var keepGoing = true;
            angular.forEach($scope.eventList, function (item) {
                if (keepGoing) {
                    if (item.id === event_id) {
                        $state.go('app.detaileventparent', { obj: item });
                        keepGoing = false;
                    }
                }
            });
        }
        $scope.showPopup = function () {
            // An elaborate, custom popup
            var myPopup = $ionicPopup.show({
                template: '<div>' + $scope.aclMessage + '</div>',
                title: '',
                subTitle: '',
                scope: $scope
            });
            myPopup.then(function (res) {
                console.log('Tapped!', res);
            });
            $timeout(function () {
                myPopup.close(); //close the popup after 3 seconds for some reason
            }, 3000);
        };
        $scope.recentEvent();
    })

    .controller('DetailEventParentCtrl', function ($scope, $state, $timeout, ionicMaterialInk, $ionicSideMenuDelegate, $stateParams) {
        $scope.$parent.clearFabs();
        $scope.isExpanded = false;
        $scope.$parent.setExpanded(false);
        $scope.$parent.setHeaderFab(false);
        // Set Header
        $scope.$parent.hideHeader();
        // Set Ink
        ionicMaterialInk.displayEffect();
        //Side-Menu
        $ionicSideMenuDelegate.canDragContent(true);
        $scope.noticeBoard = function () {
            $state.go('app.sharedNotification');
        };
        $scope.startEventTime = new Date();
        $scope.endEventTime = new Date();
        $scope.eventdetailsList = $stateParams;
    })

    .controller('EventStatusTeacherCtrl', function ($state, $scope, $http, $timeout, ionicMaterialInk, $ionicSideMenuDelegate, $stateParams, userSessions, GLOBALS, $ionicPopup, $ionicLoading) {
        $scope.$parent.clearFabs();
        $scope.isExpanded = false;
        $scope.$parent.setExpanded(false);
        $scope.$parent.setHeaderFab(false);
        // Set Header
        $scope.$parent.hideHeader();
        // Set Ink
        ionicMaterialInk.displayEffect();
        //Side-Menu
        $ionicSideMenuDelegate.canDragContent(true);
        $scope.noticeBoard = function () {
            $state.go('app.sharedNotification');
        };
        $scope.startEventTime = new Date();
        $scope.endEventTime = new Date();
        $scope.eventdetailsList = $stateParams;
        $scope.draftEventForPublish = function (eventId) {
            $ionicLoading.show({
                template: 'Loading...',
            })
            $ionicLoading.show();
            var url = GLOBALS.baseUrl + "user/send-for-publish-event?token=" + userSessions.userSession.userToken;
            $http.post(url, { event_id: eventId, _method: 'PUT' })
                .success(function (response) {
                    if (response['status'] == 200) {
                        $scope.responseMessage = response['message'];
                        $state.go('app.eventlandingteacher');
                        $ionicLoading.hide();
                        $scope.showPopup();
                        $state.go(app.eventlandingteacher);
                    } else {
                        $scope.responseMessage = response['message'];
                        $scope.showPopup();
                    }
                }).error(function (err) {
                    $scope.responseMessage = "You do not have permission,please contact admin!!!";
                    $scope.showPopup();
                });
        }
        $scope.deleteEvent = function (eventId) {
            var url = GLOBALS.baseUrl + "user/delete-event?token=" + userSessions.userSession.userToken;
            $http.post(url, { event_id: eventId, _method: 'PUT' })
                .success(function (response) {
                    if (response['status'] == 200) {
                        $scope.responseMessage = response['message'];
                        $scope.showPopup();
                        $state.go(app.eventlandingteacher);
                    } else {
                        $scope.responseMessage = response['message'];
                        $scope.showPopup();
                    }
                }).error(function (err) {
                    $scope.responseMessage = "Something Went Worng!!!";
                    $scope.showPopup();
                });
        }
        $scope.editEvent = function () {
            $state.go('app.eventedit', { 'obj': $stateParams });
        }
        $scope.showPopup = function () {
            // An elaborate, custom popup
            var myPopup = $ionicPopup.show({
                template: '<div>' + $scope.responseMessage + '</div>',
                title: '',
                subTitle: '',
                scope: $scope
            });
            myPopup.then(function (res) {
                console.log('Tapped!', res);
            });
            $timeout(function () {
                myPopup.close(); //close the popup after 3 seconds for some reason
            }, 3000);
        }
    })

    .controller('EventStatusPublicCtrl', function ($state, $scope, $http, $timeout, ionicMaterialInk, $ionicSideMenuDelegate, $stateParams, userSessions, GLOBALS, $ionicPopup, $ionicLoading, $ionicHistory) {
        $scope.$parent.clearFabs();
        $scope.isExpanded = false;
        $scope.$parent.setExpanded(false);
        $scope.$parent.setHeaderFab(false);
        // Set Header
        $scope.$parent.hideHeader();
        // Set Ink
        ionicMaterialInk.displayEffect();
        //Side-Menu
        $ionicSideMenuDelegate.canDragContent(false);
        $scope.startEventTime = new Date();
        $scope.endEventTime = new Date();
        $scope.eventdetailsList = $stateParams;
        $scope.myGoBack = function () {
            $ionicHistory.goBack();
        }
    })

    .controller('EditEventCtrl', function ($ionicLoading, $ionicPopup, GLOBALS, $http, userSessions, $scope, $state, $filter, $timeout, ionicMaterialInk, $ionicSideMenuDelegate, $stateParams) {
        $scope.$parent.clearFabs();
        $scope.isExpanded = false;
        $scope.$parent.setExpanded(false);
        $scope.$parent.setHeaderFab(false);
        $scope.$parent.hideHeader();
        ionicMaterialInk.displayEffect();
        $ionicSideMenuDelegate.canDragContent(true);
        $scope.noticeBoard = function () {
            $state.go('app.sharedNotification');
        };
        $scope.onChange = function (e, fileList) {
        }
        $scope.onLoad = function (e, reader, file, fileList, fileOjects, fileObj) {
            $scope.image = fileObj.base64;
        }
        var uploadedCount = 0;
        $scope.files = [];
        $scope.eventData = $stateParams.obj;
        $scope.minDate = new Date();
        $scope.eventTitle = null
        $scope.eventDetail = null;
        $scope.eventImage = null;
        $scope.responseMessage = null;
        $scope.statusEvent = 0;
        $scope.setEventStartDate = function (startEventTime) {
            $scope.startEventTime = startEventTime;
        }
        $scope.setEventEndDate = function (endEventTime) {
            $scope.endEventTime = endEventTime;
        }
        $scope.setEventTitle = function (title) {
            $scope.eventTitle = title;
        }
        $scope.setEventDetail = function (detail) {

            $scope.eventDetail = detail;
        }
        $scope.setImage = function (image) {
            $scope.eventImage = image;
        }
        angular.forEach($scope.eventData, function (event) {
            $scope.eventTitle = event.title;
            $scope.eventDetail = event.detail;
            $scope.eventImage = event.path;
            $scope.statusEvent = 0;
            $scope.startEventTime = event.start_date;
            $scope.endEventTime = event.end_date;
        });
        var pqr = $scope.eventData.obj['id'];
        $scope.saveAsDraftEvent = function () {
            $scope.statusEvent = 0;
            $scope.craeteEventWithPublishAndDraft($scope.statusEvent); //ststus  = 1 => Send for approval : pending
        }

        $scope.showPopup = function () {
            // An elaborate, custom popup
            var myPopup = $ionicPopup.show({
                template: '<div>' + $scope.responseMessage + '</div>',
                title: '',
                subTitle: '',
                scope: $scope
            });
            myPopup.then(function (res) {
                console.log('Tapped!', res);
            });
            $timeout(function () {
                myPopup.close(); //close the popup after 3 seconds for some reason
            }, 3000);
        }
        $scope.updateEvent = function (statusEvent) {
            $ionicLoading.show({
                template: 'Loading...',
                duration: 3000
            })
            $ionicLoading.show();
            if ($scope.eventTitle == null || $scope.eventDetail == null || $scope.startEventTime == null || $scope.endEventTime == null) {
                if ($scope.eventTitle == null) {
                    $scope.responseMessage = "Fil mandatory fields";
                }
                if ($scope.eventDetail == null) {
                    $scope.responseMessage = "Fi mandatory fields";
                }
                if ($scope.startEventTime == null) {
                    $scope.responseMessage = "F mandatory fields";
                }
                if ($scope.endEventTime == null) {
                    $scope.responseMessage = " mandatory fields";
                }
                $ionicLoading.hide();
                $scope.showPopup();
            } else {

                $scope.startEventTime = $filter('date')($scope.startEventTime, "yyyy-MM-dd");
                $scope.endEventTime = $filter('date')($scope.endEventTime, "yyyy-MM-dd");

                var url = GLOBALS.baseUrl + "user/edit-event?token=" + userSessions.userSession.userToken;
                $http.post(url, { _method: "PUT", event_id: pqr, title: $scope.eventTitle, detail: $scope.eventDetail, start_date: $scope.startEventTime, end_date: $scope.endEventTime, imageBase: $scope.image, status: statusEvent, flag: 1 })

                    .success(function (response) {
                        if (response['status'] == 200) {
                            $scope.responseMessage = response['message'];
                            $ionicLoading.hide();
                            $scope.showPopup();

                        } else {
                            $scope.responseMessage = response['message'];
                            $ionicLoading.hide();
                            $scope.showPopup();
                        }
                    }).error(function (err) {
                        $scope.responseMessage = "Something Went Worng!!!";
                        $ionicLoading.hide();
                        $scope.showPopup();
                    });
                $state.go('app.eventlandingpublic');
            }
        }
    })

    .controller('CreateEventCtrl', function ($ionicHistory, $ionicLoading, $filter, $scope, $state, GLOBALS, $timeout, $http, userSessions, ionicMaterialInk, $ionicSideMenuDelegate, $ionicPopup, $cordovaCamera, $cordovaFile, $cordovaFileTransfer, $cordovaDevice, $cordovaActionSheet, $cordovaImagePicker, $ionicPlatform) {
        $scope.$on("$ionicView.beforeEnter", function (event, data) {

            // handle event$scope.show = function() {
            $ionicLoading.show({
                template: 'Loading...',
                duration: 3000
            })
            $scope.showAlert = function () {
                var alertPopup = $ionicPopup.alert({
                    title: 'Under construction!',
                    template: 'We are working on that.'
                });
            }
            $scope.myGoBack = function () {
                $ionicHistory.goBack();
            };
            $scope.hide = function () {
                $ionicLoading.hide().then(function () {
                    console.log("The loading indicator is now hidden");
                });
            }
        });
        $scope.onChange = function (e, fileList) {
        }
        $scope.onLoad = function (e, reader, file, fileList, fileOjects, fileObj) {
            $scope.image = fileObj.base64;
        }
        $scope.currentDate = new Date();
        $scope.minDate = new Date(2105, 6, 1);
        $scope.maxDate = new Date(2015, 6, 31);
        $scope.datePickerCallback = function (val) {
            if (!val) {
                console.log('Date not selected');
            } else {
                console.log('Selected date is : ', val);
            }
        }
        var uploadedCount = 0;
        $scope.files = [];
        $scope.$parent.clearFabs();
        $scope.isExpanded = false;
        $scope.$parent.setExpanded(false);
        $scope.$parent.setHeaderFab(false);
        // Set Header
        $scope.$parent.hideHeader();
        // Set Ink
        ionicMaterialInk.displayEffect();
        //Side-Menu
        $ionicSideMenuDelegate.canDragContent(true);
        $scope.noticeBoard = function () {
            $state.go('app.sharedNotification');
        };
        $scope.startEventTime = new Date();
        $scope.endEventTime = new Date();
        $scope.minDate = new Date();
        $scope.eventTitle = null
        $scope.eventDetail = null;
        //$scope.eventImage = null;
        $scope.responseMessage = null;
        $scope.statusEvent = 0;
        $scope.setEventTitle = function (title) {
            $scope.eventTitle = title;
        }
        $scope.setEventStartDate = function (startEventTime) {
            $scope.startEventTime = startEventTime;
        }
        $scope.setEventEndDate = function (endEventTime) {
            $scope.endEventTime = endEventTime;
        }
        $scope.setEventDetail = function (detail) {
            $scope.eventDetail = detail;
        }
        $scope.image = null;

        $scope.showAlert = function (title, msg) {
            var alertPopup = $ionicPopup.alert({
                title: title,
                template: msg
            });
        };
        $scope.loadImage = function () {
            var options = {
                title: 'Select Image Source',
                buttonLabels: ['Load from Library', 'Use Camera'],
                addCancelButtonWithLabel: 'Cancel',
                androidEnableCancelButton: true,
            };
            $cordovaActionSheet.show(options).then(function (btnIndex) {
                var type = null;
                if (btnIndex === 1) {
                    type = Camera.PictureSourceType.PHOTOLIBRARY;
                } else if (btnIndex === 2) {
                    type = Camera.PictureSourceType.CAMERA;
                }
                if (type !== null) {
                    $scope.selectPicture(type);
                }
            });
        };
        $scope.selectPicture = function (sourceType) {
            var options = {
                quality: 50,
                destinationType: Camera.DestinationType.DATA_URL,
                sourceType: Camera.PictureSourceType.CAMERA,
                allowEdit: true,
                encodingType: Camera.EncodingType.JPEG,
                targetWidth: 100,
                targetHeight: 100,
                popoverOptions: CameraPopoverOptions,
                saveToPhotoAlbum: false,
                correctOrientation: true
            };
            $cordovaCamera.getPicture(options).then(function (imageData) {

                var image = document.getElementById('myImage');
                $scope.imagesrc = imageData;

                return $scope.imagesrc;
            }, function (err) {
                // error
            });
        }, false;
        $scope.publishEvent = function () {
            $scope.statusEvent = 1;
            $scope.craeteEventWithPublishAndDraft($scope.statusEvent); //ststus  = 0 => Draft
        }
        $scope.saveAsDraftEvent = function () {
            $scope.statusEvent = 0;
            $scope.craeteEventWithPublishAndDraft($scope.statusEvent); //ststus  = 1 => Send for approval : pending
        }
        $scope.craeteEventWithPublishAndDraft = function (statusEvent) {
            if ($scope.eventTitle == null || $scope.eventDetail == null || $scope.startEventTime == null || $scope.endEventTime == null) {
                if ($scope.eventTitle == null) {
                    $scope.responseMessage = "Fill mandatory fields";
                }
                if ($scope.eventDetail == null) {
                    $scope.responseMessage = "Fill mandatory fields";
                }
                if ($scope.startEventTime == null) {
                    $scope.responseMessage = "Fill StartDate properly";
                }
                if ($scope.endEventTime == null) {
                    $scope.responseMessage = "Fill EndDate properly";
                }
                $scope.showPopup();
            } else {
                $scope.startEventTime = $filter('date')($scope.startEventTime, "yyyy-MM-dd");
                $scope.endEventTime = $filter('date')($scope.endEventTime, "yyyy-MM-dd");
                var url = GLOBALS.baseUrl + "user/create-event?token=" + userSessions.userSession.userToken;
                $http.post(url, { title: $scope.eventTitle, detail: $scope.eventDetail, start_date: $scope.startEventTime, end_date: $scope.endEventTime, img: $scope.image, status: statusEvent })
                    .success(function (response) {
                        if (response['status'] == 200) {
                            $scope.responseMessage = response['message'];
                            $scope.showPopup();
                            // $state.go(app.eventlandingteacher);
                        } else {
                            $scope.responseMessage = response['message'];
                            $scope.showPopup();
                        }
                    }).error(function (err) {
                        alert("You do not have permission !");
                    });
                $scope.myGoBack();
            }
        }
        $scope.showPopup = function () {
            // An elaborate, custom popup
            var myPopup = $ionicPopup.show({
                template: '<div>' + $scope.responseMessage + '</div>',
                title: '',
                subTitle: '',
                scope: $scope
            });
            myPopup.then(function (res) {
                console.log('Tapped!', res);
            });
            $timeout(function () {
                myPopup.close(); //close the popup after 3 seconds for some reason
            }, 3000);
        }
    })

    .controller('ViewEventsCtrl', function ($scope, $state, $timeout, ionicMaterialInk, $ionicSideMenuDelegate) {

        $scope.$parent.clearFabs();
        $scope.isExpanded = false;
        $scope.$parent.setExpanded(false);
        $scope.$parent.setHeaderFab(false);
        // Set Header
        $scope.$parent.hideHeader();
        // Set Ink
        ionicMaterialInk.displayEffect();
        //Side-Menu
        $ionicSideMenuDelegate.canDragContent(true);
        $scope.options = {
            defaultDate: new Date(),
            //minDate: "2015-01-01",
            maxDate: "",
            disabledDates: [
                //      "2015-11-22",
                //    "2015-11-27"
            ],
            dayNamesLength: 3, // 1 for "M", 2 for "Mo", 3 for "Mon"; 9 will show full day names. Default is 1.
            mondayIsFirstDay: true,//set monday as first day of week. Default is false
            eventClick: function (date) {
                console.log(date['event']);
                if (date['event'][0]) {
                    // items have value
                    $scope.selectedEvents = date['event'];
                    console.log("Click " + $scope.selectedEvents);
                } else {
                    // items is still null
                    $scope.selectedEvents = { 0: { Title: 'Nothing on selected date' } };
                    console.log($scope.selectedEvents);
                }
            },
            dateClick: function (date) {
                console.log(date['event']);
                if (date['event'][0]) {
                    // items have value
                    $scope.selectedEvents = date['event'];
                    console.log("DateClick " + $scope.selectedEvents);
                    $scope.detailEvent();
                } else {
                    // items is still null
                    $scope.selectedEvents = { 0: { Title: 'Nothing on selected date' } };
                    console.log($scope.selectedEvents);
                    $scope.detailEvent();
                }
            },
            changeMonth: function (month, year) {
                console.log(month, year);
            },
            filteredEventsChange: function (filteredEvents) {
                console.log(filteredEvents);
            }
        };
    })

    .controller('CreateLeaveCtrl', function ($rootScope, $scope, $state, $timeout, $filter, ionicMaterialInk, $ionicPopup, $ionicSideMenuDelegate, GLOBALS, $http, userSessions) {
        // handle event
        //$scope.fromDate=$filter('fromDate')('yyyy dd mm');
        $scope.$parent.clearFabs();
        $scope.isExpanded = false;
        $scope.$parent.setExpanded(false);
        $scope.$parent.setHeaderFab(false);
        // Set Header
        $scope.$parent.hideHeader();
        // Set Ink
        ionicMaterialInk.displayEffect();

        //check if LC is created
        if ($rootScope.lcStatus) {
            $scope.LcStatus = $rootScope.lcStatus
            var alertPopup = $ionicPopup.alert({
                title: 'LC has been generated for this student',
                template: '  For any information please contact the school'
            });
        } else {
            $scope.LcStatus = $rootScope.lcStatus
        }

        var url = GLOBALS.baseUrl + "user/get-acl-details?token=" + userSessions.userSession.userToken;
        $http.get(url).success(function (response) {
            $scope.data = response['Data']['Acl_Modules'];
            if ($scope.data.indexOf('Create_leave') == 1) {
                $scope.msg = "Access Denied";
                $scope.showPopup();
                $state.go('app.parentattendancelanding');
            }
        }).error(function (err) {
            console.log(err);
        });
        //Side-Menu
        $ionicSideMenuDelegate.canDragContent(true);
        $scope.leaveTitle = '';
        $scope.LeaveId = '';
        $scope.checkClass = true;
        //  $scope.fromDate = new Date();
        //  $scope.toDate = new Date();
        $scope.description = '';
        $scope.setTitle = function (title) {
            $scope.leaveTitle = title;
        };
        $scope.setDescription = function (reason) {
            $scope.description = reason;
        };
        var url = GLOBALS.baseUrl + "user/leave-types/?token=" + userSessions.userSession.userToken;
        $http.get(url).success(function (response) {
            $scope.leaveType = response['data'];
            $scope.checkClass = false;
        })
            .error(function (response) {
                console.log("Error in Response: " + response);
            });
        $scope.getSelectedLeave = function (leave) {
            $scope.LeaveId = leave['id'];
        }
        $scope.updateFromDate = function (newDate) {
            $scope.fromDate = newDate;
        }
        $scope.updateToDate = function (newDate) {
            $scope.toDate = newDate;
        }
        $scope.send = function () {
            if ($scope.leaveTitle == "" || $scope.LeaveId == "" || $scope.description == "" || $scope.LeaveId == "" && $scope.leaveTitle == "" && $scope.message == "" || $scope.fromDate == '' ||
                $scope.toDate == '' || $scope.fromDate == '' && $scope.toDate == '') {
                if ($scope.leaveTitle == "") {
                    $scope.msg = "Please Add Title";
                }
                if ($scope.LeaveId == "") {
                    $scope.msg = "Select Leave Type";
                }
                if ($scope.description == "") {
                    $scope.msg = "Please Add Description";
                }
                if ($scope.fromDate == '' || $scope.toDate == '' || $scope.fromDate == '' && $scope.toDate == '') {
                    $scope.msg = "Please Check the Dates";
                }
                if ($scope.LeaveId == "" && $scope.leaveTitle == "" && $scope.message == "") {
                    $scope.msg = "Cannot create blank Leave";
                }
                $scope.showPopup();
            }
            else {
                var url = GLOBALS.baseUrl + "user/create-leave?token=" + userSessions.userSession.userToken;
                $http.post(url, { student_id: userSessions.userSession.userId, title: $scope.leaveTitle, leave_type_id: $scope.LeaveId, reason: $scope.description, from_date: $scope.fromDate, end_date: $scope.toDate })
                    .success(function (response) {
                        if (response['status'] == 200) {
                            $scope.msg = response['message'];
                            $scope.showPopup();
                            $state.go('app.parentattendancelanding');
                        }
                        else {
                            $scope.msg = response['message'];
                            $scope.showPopup();
                        }
                    })
                    .error(function (response) {
                        console.log("Error in Response: " + response);
                        if (response.hasOwnProperty('status')) {
                            $scope.msg = response.message;
                        }
                        else {
                            $scope.msg = "Access Denied";
                        }
                        $scope.showPopup();
                    });
            }
        };
        $scope.showPopup = function () {
            // An elaborate, custom popup
            var myPopup = $ionicPopup.show({
                template: '<div>' + $scope.msg + '</div>',
                title: '',
                subTitle: '',
                scope: $scope
            });
            myPopup.then(function (res) {
                console.log('Tapped!', res);
            });
            $timeout(function () {
                myPopup.close(); //close the popup after 3 seconds for some reason
            }, 3000);
        };
    })

    .controller('ViewLeaveApprovalCtrl', function ($scope, $state, $timeout, ionicMaterialInk, $ionicPopup, $ionicSideMenuDelegate, hwDetails, GLOBALS, $http, userSessions) {
        $scope.$parent.clearFabs();
        $scope.isExpanded = false;
        $scope.$parent.setExpanded(false);
        $scope.$parent.setHeaderFab(false);
        // Set Header
        $scope.$parent.hideHeader();
        // Set Ink
        ionicMaterialInk.displayEffect();
        //Side-Menu
        $ionicSideMenuDelegate.canDragContent(true);
        $scope.userRole = userSessions.userSession.userRole;
        $scope.getLeaveList = function () {
            var url = null;
            if (userSessions.userSession.userRole == 'parent') {
                url = GLOBALS.baseUrl + "user/leaves-parent/1/" + userSessions.userSession.userId + "?token=" + userSessions.userSession.userToken;
            } else {
                url = GLOBALS.baseUrl + "user/leaves-teacher/1/?token=" + userSessions.userSession.userToken;
            }
            $http.get(url).success(function (response) {
                if (response['status'] == 200) {
                    $scope.leaveListing = response['data'];
                }
                else {
                    $scope.msg = response['message'];
                    $scope.showPopup();
                }
            })
                .error(function (response) {
                    console.log("Error in Response: " + response);
                    if (response.hasOwnProperty('status')) {
                        $scope.msg = response.message;
                        $scope.showPopup();
                    }
                    else {
                        $scope.msg = "Access Denied";
                        $scope.showPopup();
                        if ($scope.userRole == 'teacher') {
                            $state.go('app.attendancelanding');
                        } else {
                            $state.go('app.parentattendancelanding');
                        }
                    }
                });
        };
        $scope.getLeaveList();
        $scope.approveLeave = function (leaveId) {
            var url = GLOBALS.baseUrl + "user/approve-leaves?token=" + userSessions.userSession.userToken;
            $http.post(url, { _method: 'PUT', leave_id: leaveId }).success(function (response) {
                if (response['status'] == 200) {
                    $scope.msg = response['message'];
                    $scope.showPopup();
                    $scope.getLeaveList();
                }
                else {
                    $scope.msg = response['message'];
                    $scope.showPopup();
                }
            })
                .error(function (response) {
                    console.log("Error in Response: " + response);
                    $scope.msg = "Access Denied";
                    $scope.showPopup();
                });
        }
        $scope.leaveDetails = function (leave) {
            $scope.checkLid = hwDetails.setHwView(leave);
            if ($scope.checkLid == true) {
                $state.go('app.leavedetails');
            };
        }
        $scope.showPopup = function () {
            // An elaborate, custom popup
            var myPopup = $ionicPopup.show({
                template: '<div>' + $scope.msg + '</div>',
                title: '',
                subTitle: '',
                scope: $scope
            });
            myPopup.then(function (res) {
                console.log('Tapped!', res);
            });
            $timeout(function () {
                myPopup.close(); //close the popup after 3 seconds for some reason
            }, 3000);
        };
    })

    .controller('ViewLeaveApprovedCtrl', function ($scope, $state, $timeout, ionicMaterialInk, $ionicPopup, $ionicSideMenuDelegate, hwDetails, GLOBALS, $http, userSessions) {
        $scope.$parent.clearFabs();
        $scope.isExpanded = false;
        $scope.$parent.setExpanded(false);
        $scope.$parent.setHeaderFab(false);
        // Set Header
        $scope.$parent.hideHeader();
        // Set Ink
        ionicMaterialInk.displayEffect();
        //Side-Menu
        $ionicSideMenuDelegate.canDragContent(true);
        $scope.userRole = userSessions.userSession.userRole;
        var url = null;
        if (userSessions.userSession.userRole == 'parent') {
            url = GLOBALS.baseUrl + "user/leaves-parent/2/" + userSessions.userSession.userId + "?token=" + userSessions.userSession.userToken;
        } else {
            url = GLOBALS.baseUrl + "user/leaves-teacher/2/?token=" + userSessions.userSession.userToken;
        }
        $scope.getLeaveList = function () {
            $http.get(url).success(function (response) {
                if (response['status'] == 200) {
                    $scope.leaveListing = response['data'];
                }
                else {
                    $scope.msg = response['message'];
                    $scope.showPopup();
                }
            })
                .error(function (response) {
                    console.log("Error in Response: " + response);
                    if (response.hasOwnProperty('status')) {
                        $scope.msg = response.message;
                        $scope.showPopup();
                    }
                    else {
                        $scope.msg = "Access Denied";
                        $scope.showPopup();
                        if ($scope.userRole == 'teacher') {
                            $state.go('app.attendancelanding');
                        } else {
                            $state.go('app.parentattendancelanding');
                        }
                    }
                });
        };
        $scope.getLeaveList();
        $scope.leaveDetails = function (leave) {
            $scope.checkLid = hwDetails.setHwView(leave);
            if ($scope.checkLid == true) {
                $state.go('app.approvedleavedetails');
            };
        }
        $scope.showPopup = function () {
            // An elaborate, custom popup
            var myPopup = $ionicPopup.show({
                template: '<div>' + $scope.msg + '</div>',
                title: '',
                subTitle: '',
                scope: $scope
            });
            myPopup.then(function (res) {
                console.log('Tapped!', res);
            });
            $timeout(function () {
                myPopup.close(); //close the popup after 3 seconds for some reason
            }, 3000);
        };
    })

    .controller('LeaveDetailCtrl', function ($scope, $state, $timeout, $ionicPopup, ionicMaterialInk, userSessions, GLOBALS, $http, hwDetails, $ionicSideMenuDelegate, $ionicModal) {
        $scope.$parent.clearFabs();
        $scope.isExpanded = false;
        $scope.$parent.setExpanded(false);
        $scope.$parent.setHeaderFab(false);
        // Set Header
        $scope.$parent.hideHeader();
        // Set Ink
        ionicMaterialInk.displayEffect();
        //Side-Menu
        $ionicSideMenuDelegate.canDragContent(true);
        $scope.userRole = userSessions.userSession.userRole;
        $scope.leaveDetail = hwDetails.getHwView();
        $scope.approveLeave = function (leaveId) {
            var url = GLOBALS.baseUrl + "user/approve-leaves?token=" + userSessions.userSession.userToken;
            $http.post(url, { _method: 'PUT', leave_id: leaveId }).success(function (response) {
                if (response['status'] == 200) {
                    $scope.msg = response['message'];
                    $scope.getLeaveList();
                    $scope.showPopup();
                }
                else {
                    $scope.msg = response['message'];
                    $scope.showPopup();
                }
            })
                .error(function (response) {
                    console.log("Error in Response: " + response);
                    $scope.msg = "Access Denied";
                    $scope.showPopup();
                });
        }
        $scope.showPopup = function () {
            // An elaborate, custom popup
            var myPopup = $ionicPopup.show({
                template: '<div>' + $scope.msg + '</div>',
                title: '',
                subTitle: '',
                scope: $scope
            });
            myPopup.then(function (res) {
                console.log('Tapped!', res);
            });
            $timeout(function () {
                myPopup.close(); //close the popup after 3 seconds for some reason
            }, 3000);
        };
    })

    .controller('DetailPageCtrl', function (userSessions, GLOBALS, $ionicPopup, $rootScope, $scope, $state, $timeout, ionicMaterialInk, $ionicSideMenuDelegate, $ionicModal, $http, $ionicLoading) {
        $scope.$parent.clearFabs();
        $scope.isExpanded = false;
        $scope.$parent.setExpanded(false);
        $scope.$parent.setHeaderFab(false);
        // Set Header
        $scope.$parent.hideHeader();
        // Set Ink
        ionicMaterialInk.displayEffect();
        $scope.DetailAchievemtns = $rootScope.DetailAchievemtns;
        $scope.imageData = $rootScope.imagesData;
        $scope.showAlertsucess = function (message) {
            console.log(message);
            var alertPopup = $ionicPopup.alert({
                title: '<img src="img/alert.jpg" height="60px" width="60px">',
                template: message
            })
        }
        $scope.editAchievment = function () {
            $state.go('app.achievementedit');
        }
        $scope.deleteAchievement = function (id) {
            var confirmPopup = $ionicPopup.confirm({
                title: 'Delete',
                template: 'Are you sure you want to delete this?'
            });
            confirmPopup.then(function (res) {
                if (res) {
                    $ionicLoading.show({
                        template: 'Loading...',
                    })
                    //Side-Menu
                    $ionicLoading.show();
                    var url = GLOBALS.baseUrl + "user/delete-achievement/" + id + "?token=" + userSessions.userSession.userToken;
                    $http.get(url).success(function (response) {
                        $scope.message = response['message'];
                        $state.go('app.sharedAchievement');
                        $ionicLoading.hide();
                        $scope.showAlertsucess($scope.message);
                    })
                        .error(function (response) {
                            $scope.message = response['message'];
                            $state.go('app.sharedAchievement');
                            $ionicLoading.hide();
                            $scope.showAlertsucess($scope.message);
                        });

                } else {
                    console.log('Deletion canceled !');
                }
            });
        }
        //Side-Menu
        $ionicSideMenuDelegate.canDragContent(true);
        $ionicModal.fromTemplateUrl('studentlist.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.modal = modal;
        })
        $scope.openModal = function () {
            $scope.modal.show();
        }
        $scope.closeModal = function () {
            $scope.modal.hide();
        };
        $scope.$on('$destroy', function () {
            // $scope.modal.remove();
        });
        $scope.noticeBoard = function () {
            $state.go('app.sharedNotification');
        };
        $scope.selectedDate = new Date();
   
        $scope.isExpanded = false;
        $scope.$parent.setExpanded(false);
        $scope.$parent.setHeaderFab(false);

        // Set Header
        $scope.$parent.hideHeader();
        // Set Ink
        ionicMaterialInk.displayEffect();

        //Side-Menu
        $ionicSideMenuDelegate.canDragContent(false);

        $scope.DetailAchievemtns = $rootScope.DetailAchievemtns;
        $scope.imageData = $rootScope.imagesData;
        $scope.showAlertsucess = function (message) {
            console.log(message);
        }
        $scope.achievementDetailParent = function (id) {
            $rootScope.DetailAchievemtns = [];
            angular.forEach($scope.nMessages, function (data) {
                if (data.id == id) {
                    $rootScope.DetailAchievemtns.push(data);
                }
            })
            $rootScope.imagesData = [];
            console.log($scope.imagesData);
            angular.forEach($scope.imagesData, function (dataa) {
                angular.forEach(dataa, function (dataImage) {
                    if (dataImage.event_id == id) {
                        $rootScope.imagesData.push(dataImage);
                    }
                })
            })
            $state.go('app.achievementDetailParent');
        };
        $scope.openModal = function () {
            $scope.modal.show();
        }
        $scope.closeModal = function () {
            $scope.modal.hide();
        };
        $scope.$on('$destroy', function () {
            // $scope.modal.remove();
        });
        $scope.noticeBoard = function () {
            $state.go('app.sharedNotification');
        };
        $scope.selectedDate = new Date();
    })


    .controller('TimeTableCtrl', function ($scope, $state, $timeout, ionicMaterialInk, $ionicSideMenuDelegate, $ionicPopup, $filter, userSessions, GLOBALS, $http) {
        $scope.$parent.clearFabs();
        $scope.isExpanded = false;
        $scope.$parent.setHeaderFab(false);
        $scope.checkBatch = true;
        $scope.checkClass = true;
        $scope.timeTableList = [];
        $scope.setDay = '';
        $scope.divId = '';
        //$scope.batchName = 'Batch';
        //$scope.className = 'Class';
        //$scope.divisionName = 'Div';
        $scope.userRole = userSessions.userSession.userRole;
        $scope.date = new Date();
        switch ($scope.currentDay = $filter('date')(new Date(), 'EEEE')) {

            case 'Monday':
                $scope.currentDay = 1;
                break;
            case 'Tuesday':
                $scope.currentDay = 2;
                break;
            case 'Wednesday':
                $scope.currentDay = 3;
                break;
            case 'Thursday':
                $scope.currentDay = 4;
                break;
            case 'Friday':
                $scope.currentDay = 5;
                break;
            case 'Saturday':
                $scope.currentDay = 6;
                break;
            case 'Sunday':
                $scope.currentDay = 7;
                break;
            default:
                $scope.currentDay = 0;
                break;
        }

        // Set Header
        $scope.$parent.hideHeader();//

        // Set Ink
        ionicMaterialInk.displayEffect();

        //Side-Menu
        $ionicSideMenuDelegate.canDragContent(true);

        $scope.getClass = function (batch) {
            var url = GLOBALS.baseUrl + "user/get-classes/" + batch + "?token=" + userSessions.userSession.userToken;
            $http.get(url).success(function (response) {
                $scope.classList = response['data'];
                $scope.className = 'Class';
                $scope.divisionName = 'Div';
                $scope.checkBatch = false;
            })
                .error(function (response) {
                    console.log("Error in Response: " + response);
                });
        };

        $scope.getDivision = function (classType) {
            var url = GLOBALS.baseUrl + "user/get-divisions/" + classType + "?token=" + userSessions.userSession.userToken;
            $http.get(url).success(function (response) {
                $scope.divisionsList = response['data'];
                $scope.checkClass = false;
            })
                .error(function (response) {
                    console.log("Error in Response: " + response);
                });
        };


        $scope.defaultTimetable = function (batchName, className, divisionName) {
            var url = null;
            if (userSessions.userSession.userRole == "parent") {
                url = GLOBALS.baseUrl + "user/view-timetable-parent/" + userSessions.userSession.userId + "/" + $scope.currentDay + "?token=" + userSessions.userSession.userToken;
            } else {
                url = GLOBALS.baseUrl + "user/default-timetable-teacher?token=" + userSessions.userSession.userToken;
            }
            $http.get(url).success(function (response) {
                if (response['status'] == 200) {
                    $scope.timeTableList = response['data']['timetable'];
                    $scope.divId = response['data']['div_id'];
                    $scope.setDay = response['data']['day'];
                    if (userSessions.userSession.userRole == "teacher") {
                        $scope.batchName = response['data']['batchName'];
                        $scope.className = response['data']['className'];
                        $scope.divisionName = response['data']['divisionName'];
                        $scope.classId = response['data']['classId'];
                        $scope.batchId = response['data']['batchId'];
                        $scope.getClass($scope.batchId);
                        $scope.getDivision($scope.classId);
                    }
                } else {
                    $scope.timeTableList = response['data']['timetable'];
                    $scope.divId = response['data']['div_id'];
                    $scope.setDay = response['data']['day'];
                    if (userSessions.userSession.userRole == "teacher") {
                        $scope.batchName = response['data']['batchName'];
                        $scope.className = response['data']['className'];
                        $scope.divisionName = response['data']['divisionName'];
                    }
                    $scope.message = response['message'];
                    $scope.showPopupError();
                }
            })
                .error(function (response) {
                    console.log("Error in Response: " + response);
                    if (response.hasOwnProperty('status')) {
                        $scope.message = response['message'];
                        $scope.timeTableList = response['data']['timetable'];
                        $scope.divId = response['data']['div_id'];
                        $scope.setDay = response['data']['day'];
                        if (userSessions.userSession.userRole == "teacher") {
                            $scope.batchName = response['data']['batchName'];
                            $scope.className = response['data']['className'];
                            $scope.divisionName = response['data']['divisionName'];
                            $scope.classId = response['data']['classId'];
                            $scope.batchId = response['data']['batchId'];
                            $scope.getClass($scope.batchId);
                            $scope.getDivision($scope.classId);
                            $scope.showPopupError();
                        }
                    }
                    else {
                        $scope.message = "Access Denied";
                        $scope.showPopupError();
                        $state.go('app.dashboard');
                    }

                });
        };

        $scope.defaultTimetable();

        $scope.getTimetable = function (day) {
            var url = null;
            if (userSessions.userSession.userRole == "parent") {
                url = GLOBALS.baseUrl + "user/view-timetable-parent/" + userSessions.userSession.userId + "/" + day + "?token=" + userSessions.userSession.userToken;
            } else {
                url = GLOBALS.baseUrl + "user/view-timetable-teacher/" + $scope.divId + "/" + day + "?token=" + userSessions.userSession.userToken;
            }
            $http.get(url).success(function (response) {
                if (response['status'] == 200) {
                    $scope.timeTableList = response['data']['timetable'];
                    $scope.divId = response['data']['div_id'];
                    $scope.setDay = response['data']['day'];
                    if (userSessions.userSession.userRole == "teacher") {
                        $scope.batchName = response['data']['batchName'];
                        $scope.className = response['data']['className'];
                        $scope.divisionName = response['data']['divisionName'];
                    }
                } else {
                    $scope.timeTableList = response['data']['timetable'];
                    $scope.divId = response['data']['div_id'];
                    $scope.setDay = response['data']['day'];
                    if (userSessions.userSession.userRole == "teacher") {
                        $scope.batchName = response['data']['batchName'];
                        $scope.className = response['data']['className'];
                        $scope.divisionName = response['data']['divisionName'];
                    }
                    $scope.message = response['message'];
                    $scope.showPopupError();
                }
            })
                .error(function (response) {
                    console.log("Error in Response: " + response);
                    if (response.hasOwnProperty('status')) {
                        $scope.message = response['message'];
                        $scope.timeTableList = response['data']['timetable'];
                        $scope.divId = response['data']['div_id'];
                        $scope.setDay = response['data']['day'];
                        if (userSessions.userSession.userRole == "teacher") {
                            $scope.batchName = response['data']['batchName'];
                            $scope.className = response['data']['className'];
                            $scope.divisionName = response['data']['divisionName'];
                        }
                    }
                    else {
                        $scope.message = "Access Denied";
                    }
                    $scope.showPopupError();
                });
        };
        if ($scope.userRole != 'parent') {
            var url = GLOBALS.baseUrl + "user/get-batches?token=" + userSessions.userSession.userToken;
            $http.get(url).success(function (response) {
                $scope.batchList = response['data'];

            })
                .error(function (response) {
                    console.log("Error in Response: " + response);
                });

        };


        $scope.getDivId = function (division) {
            $scope.divId = division['id'];
        }
        // Triggered on a button click, or some other target
        $scope.showPopupError = function () {
            // An elaborate, custom popup
            var myPopupError = $ionicPopup.show({
                template: '<div class = "row"><span class = "align-center red-font text-center-align">' + $scope.message + '</span></div>',
                title: '',
                subTitle: '',

                scope: $scope
            });
            myPopupError.then(function (res) {
                console.log('Tapped!', res);
            });
            $timeout(function () {
                myPopupError.close(); //close the popup after 3 seconds for some reason
            }, 3000);
        };

        $scope.showPopup = function () {
            $scope.data = {}

            // An elaborate, custom popup
            var myPopup = $ionicPopup.show({
                template: '<div class="list">' +
                    '<div class="row">' +
                    '<div class="col-33 border-bottom">' +

                    '<select class="item item-input item-select" ng-model="selectedBatch.batch" ng-options="batch.name for batch in batchList track by batch.id" ng-change="getClass(selectedBatch.batch.id)">' +
                    '<option value="" ng-disabled="true" ng-model="batchName">-{{batchName}}-</option>' +
                    '</select>' +
                    '</div>' +
                    '<div class="col-33 border-right border-bottom">' +

                    '<select class="item item-input item-select" ng-model="selectedClass.class" ng-options="class.name for class in classList track by class.id" ng-change="getDivision(selectedClass.class.id)">' +
                    '<option value="" ng-disabled="true" ng-model="className">-{{className}}-</option>' +
                    '</select>' +
                    '</div>' +
                    '<div class="col-33 border-bottom">' +
                    '<select class="item item-input item-select" ng-model="selectedDivision.division" ng-options="division.name for division in divisionsList track by division.id" ng-change="getDivId(selectedDivision.division)">' +
                    '<option value="" ng-disabled="true" ng-model="divisionName">-{{divisionName}}-</option>' +
                    '</select>' +
                    '</div>' +
                    '</div>' +
                    '</div>',
                title: 'Select Details',
                subTitle: '',
                scope: $scope,
                buttons: [
                    { text: 'Cancel' },
                    {
                        text: '<b>Ok</b>',
                        type: 'button-timetable',
                        onTap: function (e) {
                            $scope.getTimetable($scope.currentDay);
                            myPopup.close();
                        }
                    }
                ]
            });
            myPopup.then(function (res) {
                console.log('Tapped!', res);
            });
        };
    })

    .controller('ResultViewCntrl', function ($scope, $state, $timeout, ionicMaterialInk, $ionicSideMenuDelegate, $ionicModal, $ionicPopup) {
        $scope.$parent.clearFabs();
        $scope.isExpanded = false;
        $scope.$parent.setExpanded(false);
        $scope.$parent.setHeaderFab(false);

        // Set Header
        $scope.$parent.hideHeader();

        // Set Ink
        ionicMaterialInk.displayEffect();

        //Side-Menu
        $ionicSideMenuDelegate.canDragContent(true);

        // Triggered on a button click, or some other target
        $scope.showPopup = function () {
            $scope.data = {}

            // An elaborate, custom popup
            var myPopup = $ionicPopup.show({
                template: '<div class="list">' +
                    '<div class="row">' +
                    '<div class="col-33 border-bottom">' +
                    '<select class="item item-input item-select">' +
                    '<option selected class="padding-top-5">Batch</option>' +
                    '<option class="padding-top-5">Morning</option>' +
                    '<option class="padding-top-5">Afternoon</option>' +
                    '<option class="padding-top-5">Evening</option>' +
                    '</select>' +
                    '</div>' +
                    '<div class="col-33 border-bottom">' +
                    '<select class="item item-input item-select">' +
                    '<option selected class="padding-top-5">Class</option>' +
                    '<option class="padding-top-5">Class I</option>' +
                    '<option class="padding-top-5">Class II</option>' +
                    '<option class="padding-top-5">Class III</option>' +
                    '</select>' +
                    '</div>' +
                    '<div class="col-33 border-bottom">' +
                    '<select class="item item-input item-select">' +
                    '<option selected class="padding-top-5">Div</option>' +
                    '<option class="padding-top-5">Div A</option>' +
                    '<option class="padding-top-5">Div B</option>' +
                    '<option class="padding-top-5">Div C</option>' +
                    '</select>' +
                    '</div>' +
                    '</div>' +
                    '<div class="row">' +
                    '<label class="item item-input border-bottom">' +
                    '<input type="text" placeholder="+ Select Student" ng-click="openModal()" ng-model="data.studName">' +
                    '</label>' +
                    '</div>' +
                    '</div>',
                title: 'Select Details',
                subTitle: '',
                scope: $scope,
                buttons: [
                    { text: 'Cancel' },
                    {
                        text: '<b>Save</b>',
                        type: 'button-yellow',
                        onTap: function (e) {
                            if (!$scope.data.studName) {
                                myPopup.close();
                            } else {
                                //return $scope.data.studName;
                                myPopup.close();
                            }
                        }
                    }
                ]
            });
            myPopup.then(function (res) {
                console.log('Tapped!', res);
            });
            $timeout(function () {
                myPopup.close(); //close the popup after 8 seconds for some reason
            }, 40000);
        };

        $scope.subGraphPopup = function () { //
            $scope.data = {}

            // An elaborate, custom popup
            var myPopup = $ionicPopup.show({
                template: '<div class="card">' +
                    '<highchart id="chart1" config="chartSubConfig"></highchart>' +
                    '</div>',
                title: 'Subject Graph',
                subTitle: '',
                scope: $scope,
                buttons: [
                    {
                        text: '<b>Close</b>',
                        type: 'button-assertive',
                        onTap: function (e) {
                            if (!$scope.data.studName) {
                                myPopup.close();
                            } else {
                                //return $scope.data.studName;
                                myPopup.close();
                            }
                        }
                    }
                ]
            });
            myPopup.then(function (res) {
                console.log('Tapped!', res);
            });
            //            $timeout(function() {
            //                myPopup.close(); //close the popup after 8 seconds for some reason
            //            }, 40000);
        };

        $scope.testGraphPopup = function () {
            $scope.data = {}

            // An elaborate, custom popup
            var myPopup = $ionicPopup.show({
                template: '<div class="card">' +
                    '<highchart id="chart1" config="chartTestConfig"></highchart>' +
                    '</div>',
                title: 'Test Graph',
                subTitle: '',
                scope: $scope,
                buttons: [
                    {
                        text: '<b>Close</b>',
                        type: 'button-assertive',
                        onTap: function (e) {
                            if (!$scope.data.studName) {
                                myPopup.close();
                            } else {
                                //return $scope.data.studName;
                                myPopup.close();
                            }
                        }
                    }
                ]
            });
            myPopup.then(function (res) {
                console.log('Tapped!', res);
            });
            $timeout(function () {
                myPopup.close(); //close the popup after 8 seconds for some reason
            }, 40000);
        };

        $ionicModal.fromTemplateUrl('studentCntctlist.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.modal = modal;
        })

        $scope.openModal = function () {
            $scope.modal.show();
        }

        $scope.closeModal = function () {
            $scope.modal.hide();
        };

        $scope.$on('$destroy', function () {
            // $scope.modal.remove();
        });

        $scope.contactList = [{
            Name: "Student 1"
        }, {
            Name: "Student 2"
        }, {
            Name: "Student 3"
        }, {
            Name: "Student 4"
        }, {
            Name: "Student 5"
        }, {
            Name: "Student 6"
        }, {
            Name: "Student 7"
        }, {
            Name: "Student 8"
        }, {
            Name: "Student 9"
        }, {
            Name: "Student 10"
        }, {
            Name: "Student 11"
        }, {
            Name: "Student 12"
        }, {
            Name: "Student 13"
        }, {
            Name: "Student 14"
        }];

        $scope.chartSubConfig = {
            options: {
                chart: {
                    type: 'bar'
                }
            },
            series: [{
                data: [45, 78, 69, 82, 71]
            }],
            title: {
                text: 'English'
            },

            loading: false,
            size: {
                height: 400
            },
            yAxis: {

                title: { text: 'Marks' }
            }

        };
        $scope.chartTestConfig = {
            options: {
                chart: {
                    type: 'bar'
                }
            },
            series: [{
                data: [45, 78, 69, 82, 71]
            }],
            title: {
                text: 'Test Graph'
            },

            loading: false,
            size: {
                height: 400
            },
            yAxis: {

                title: { text: 'Marks' }
            }

        };

    })
    .controller('SelectSchoolCtr',
        function (
            $rootScope,
            $scope,
            $ionicPopup,
            $state
        ) {
            $scope.showSelectSchoolAlert = function () {
                var alertPopup = $ionicPopup.alert({
                    title: 'Please select a School'
                });
            }
            $scope.getSchoolDetails = function (id) {
                $rootScope.organisationID = id;
            }
            $scope.goToLogin = function () {
                $state.go('login');
            }
            $scope.goToPublicDashboard = function () {
                if (0 < $rootScope.organisationID && $rootScope.organisationID <= 2) {
                    $state.go('publicDashboard');
                }
                else {
                    $scope.showSelectSchoolAlert();
                }
            }
        })

    .controller('PublicDashboardCtr',
        function (
            $scope,
            $state,
            $rootScope
        ) {
            $scope.goBackToSelectSchool = function () {
                $rootScope.organisationID = 0;
                $state.go('selectschool');
            };
            $scope.goToPublicEventsLanding = function () {
                $state.go('publicEvents')
            }
            $scope.goToPublicAchievementLanding = function () {
                $state.go('app.achievementpublic')
            }
            $scope.goToPublicGalleryLanding = function () {
                $state.go("publicGallary")
            }
            $scope.goToPublicAboutUsLanding = function () {
                $state.go("publicAboutUs")
            }
        })

    .controller('PublicEventCtr',
        function (
            $ionicLoading,
            $ionicPopup,
            GLOBALS,
            $http,
            userSessions,
            $scope,
            $state,
            $filter,
            $timeout,
            ionicMaterialInk,
            $ionicSideMenuDelegate,
            $stateParams,
            $rootScope
        ) {
            $scope.hidden = true;
            $scope.hiddenn = true;
            $scope.goBackToPublicDashboard = function () {
                $state.go('publicDashboard')
            };
            $scope.recentEvent = function () {
                var url = GLOBALS.baseUrl + "user/view-top-five-event-new";
                $http.post(url, { body_id: $rootScope.organisationID, _method: 'POST' })
                    .success(function (response) {
                        if (response['status'] == 200) {
                            $scope.eventList = response['data'];
                        } else {
                            $scope.responseMessage = response['message'];
                            $scope.showPopup();
                        }
                    }).error(function (err) {
                        $scope.responseMessage = "You do not have permission,please contact admin!!!";
                        $scope.showPopup();
                    });
            }

            $scope.eventYearMonth = function () {
                var url = GLOBALS.baseUrl + "user/public-get-year-month";
                $http.get(url).success(function (response) {
                    if (response['status'] == 200) {
                        $scope.yearMonthData = response['data'];
                        if ($scope.yearMonthData == '') {
                            $scope.aclMessage = response['message'];
                            $scope.showPopup();
                        }
                    } else {
                        $scope.aclMessage = response['message'];
                        $scope.showPopup();
                    }
                }).error(function (err) {
                    $scope.aclMessage = "Data not found for this Instance!!!";
                    $scope.showPopup();
                });
            }
            $scope.eventYearMonth();
            $scope.setMonth = function (year) {
                $scope.monthList = null;
                angular.forEach($scope.yearMonthData, function (item) {
                    if (item.year === year) {
                        $scope.monthList = item.month[0];
                    }
                });
            }
            $scope.setMonth($scope.selectedYear);
            $scope.eventByMonth = function (month) {
                var url = GLOBALS.baseUrl + "user/view-months-event/" + $scope.selectedYear + "/" + month;
                $http.get(url).success(function (response) {
                    if (response['status'] == 200) {
                        console.log(response['data']);
                        $scope.eventList = response['data'];
                        console.log($scope.eventList);
                        if ($scope.eventList == '') {
                            $scope.aclMessage = response['message'];
                            $scope.showPopup();
                        }
                    } else {
                        $scope.aclMessage = response['message'];
                        $scope.showPopup();
                    }
                }).error(function (err) {
                    $scope.aclMessage = "Event Not Found For This Instance!!!";
                    $scope.showPopup();
                });
            }
            $scope.getDetailsOfEvent = function (event_id) {
                var keepGoing = true;
                angular.forEach($scope.eventList, function (item) {
                    if (keepGoing) {
                        if (item.id === event_id) {
                            $state.go('app.eventstatuspublic', { obj: item });
                            keepGoing = false;
                        }
                    }
                });
            }
            $scope.showPopup = function () {
                // An elaborate, custom popup
                var myPopup = $ionicPopup.show({
                    template: '<div>' + $scope.aclMessage + '</div>',
                    title: '',
                    subTitle: '',
                    scope: $scope
                });
                myPopup.then(function (res) {
                    console.log('Tapped!', res);
                });
                $timeout(function () {
                    myPopup.close(); //close the popup after 3 seconds for some reason
                }, 3000);
            };
            $scope.recentEvent();
        })
    .controller('EventStatusPublicCtrl',
        function (
            $scope,
            ionicMaterialInk,
            $ionicSideMenuDelegate,
            $stateParams,
            $ionicHistory
        ) {
            $scope.$parent.clearFabs();
            $scope.isExpanded = false;
            $scope.$parent.setExpanded(false);
            $scope.$parent.setHeaderFab(false);
            // Set Header
            $scope.$parent.hideHeader();
            // Set Ink
            ionicMaterialInk.displayEffect();
            //Side-Menu
            $ionicSideMenuDelegate.canDragContent(false);
            $scope.startEventTime = new Date();
            $scope.endEventTime = new Date();
            $scope.eventdetailsList = $stateParams;
            $scope.myGoBack = function () {
                $ionicHistory.goBack();
            }
        })

    .controller('PublicAchievementDetail',
        function (
            $ionicScrollDelegate,
            $rootScope,
            $ionicLoading,
            $ionicPopup,
            GLOBALS,
            $http,
            userSessions,
            $scope,
            $state,
            $filter,
            $timeout,
            ionicMaterialInk,
            $ionicSideMenuDelegate,
            $stateParams
        ) {
            $scope.$parent.clearFabs();
            $scope.isExpanded = false;
            $scope.$parent.setExpanded(false);
            $scope.$parent.setHeaderFab(false);

            // Set Header
            $scope.$parent.hideHeader();
            // Set Ink
            ionicMaterialInk.displayEffect();

            //Side-Menu
            $ionicSideMenuDelegate.canDragContent(false);

            $scope.DetailAchievemtns = $rootScope.DetailAchievemtns;
            $scope.imageData = $rootScope.imagesData;
            $scope.showAlertsucess = function (message) {
                console.log(message);
            }
            $scope.achievementDetailParent = function (id) {
                $rootScope.DetailAchievemtns = [];
                angular.forEach($scope.nMessages, function (data) {
                    if (data.id == id) {
                        $rootScope.DetailAchievemtns.push(data);
                    }
                })
                $rootScope.imagesData = [];
                console.log($scope.imagesData);
                angular.forEach($scope.imagesData, function (dataa) {
                    angular.forEach(dataa, function (dataImage) {
                        if (dataImage.event_id == id) {
                            $rootScope.imagesData.push(dataImage);
                        }
                    })
                })
                $state.go('app.achievementDetailParent');
            };
            $scope.openModal = function () {
                $scope.modal.show();
            }
            $scope.closeModal = function () {
                $scope.modal.hide();
            };
            $scope.$on('$destroy', function () {
                // $scope.modal.remove();
            });
            $scope.noticeBoard = function () {
                $state.go('app.sharedNotification');
            };
            $scope.selectedDate = new Date();
        })
    .controller('PublicGallaryCtrl',
        function (
            $ionicScrollDelegate,
            $rootScope,
            $ionicLoading,
            $ionicPopup,
            GLOBALS,
            $http,
            userSessions,
            $scope,
            $state,
            $filter,
            $timeout,
            ionicMaterialInk,
            $ionicSideMenuDelegate,
            $stateParams
        ) {
            $scope.baseImageURL = GLOBALS.baseUrlImage
            var url = GLOBALS.baseUrl + "user/folder-first-image/" + $rootScope.organisationID;
            $http.get(url).success(function (response) {
                if (response.status == 200) {
                    $scope.folders_size = response.data.folder_list.length;
                    if ($scope.folders_size > 0) {
                        $scope.folders = response.data.folder_list;
                    } else {
                        $scope.showAlertsucess("No data found")
                    }
                } else {
                    $scope.showAlertsucess("No data found")
                }

            }).error(function (err) {
            });
            $scope.showAlertsucess = function (message) {
                var alertPopup = $ionicPopup.alert({
                    template: '<center>' + message + '<center>'
                })
            }

            $scope.galleryFolder = function (folderID) {
                $state.go('publicGallaryLanding', { obj: folderID });
            }
            $scope.myGoBack = function () {
                $state.go('publicDashboard')
            }

        })
    .controller('PublicGallaryLandingCtrl',
        function (
            $ionicScrollDelegate,
            $ionicLoading,
            $ionicPopup,
            GLOBALS,
            $http,
            userSessions,
            $scope,
            $state,
            $filter,
            $timeout,
            ionicMaterialInk,
            $ionicSideMenuDelegate,
            $stateParams,
            $ionicPlatform,
            $ionicModal,
            $sce
        ) {
            $scope.baseImageURL = GLOBALS.baseUrlImage
            $scope.folderID = $stateParams.obj;
            screen.orientation.unlock();
            $ionicScrollDelegate.scrollTop();
            $ionicLoading.show({
                template: 'Loading...',
                duration: 1500
            });
            var url = GLOBALS.baseUrl + "user/gallery-image/" + $scope.folderID;
            $http.get(url).success(function (response) {
                if (response['status'] == 200) {
                    $scope.folderName = response.data[0].name;
                    $scope.imagesLength = response.data[0].photos.length
                    $scope.videoLength = response.data[0].videos.length
                    if ($scope.imagesLength > 0) {
                        $scope.images = response.data[0].photos;
                    }
                    if ($scope.videoLength > 0) {
                        $scope.video = response.data[0].videos
                    }
                    if ($scope.imagesLength == 0 && $scope.videoLength == 0) {
                        $timeout(function () {
                            $scope.showAlertsucess('No Data Uploaded yet')
                        }, 1500);
                    }
                } else {
                    $scope.showAlertsucess('No Data found')
                }
            })
            $scope.showAlertsucess = function (message) {
                var alertPopup = $ionicPopup.alert({
                    template: '<center>' + message + '<center>'
                })
            }
            $ionicLoading.show({
                template: 'Loading...',
                duration: 1500
            })
            $scope.myGoBack = function () {
                $state.go('publicGallary')
            }
            $scope.showImages = function (index) {
                $scope.activeSlide = index;
                $scope.showModal('templates/image-popover.html');
            };
            $scope.showModal = function (templateUrl) {
                $ionicModal.fromTemplateUrl(templateUrl, {
                    scope: $scope,
                    animation: 'slide-in-up'
                }).then(function (modal) {
                    $scope.modal = modal;
                    $scope.modal.show();
                });
            }
            // Close the modal
            $scope.closeModal = function () {
                $scope.modal.remove();
                $scope.modal.hide();

            };
            $ionicPlatform.onHardwareBackButton(function () {
                $scope.modal.remove();
                $scope.modal.hide();

            });
            $scope.trustSrc = function (src) {
                return $sce.trustAsResourceUrl($scope.baseImageURL + src);
            };
            $scope.playVideo = function () {
                $ionicScrollDelegate.scrollTop();
                $scope.showModal('templates/video-popover.html');
            }
            $scope.zoomMin = 1;
        }); // end of Ctrl
