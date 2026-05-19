#!/usr/bin/env python3

import requests
import sys
import json
from datetime import datetime
import time

class CrimePredictionAPITester:
    def __init__(self, base_url="https://risk-map.preview.emergentagent.com"):
        self.base_url = base_url
        self.session = requests.Session()
        self.tests_run = 0
        self.tests_passed = 0
        self.admin_credentials = {"email": "admin@crime.com", "password": "admin123"}
        self.test_user_id = None
        self.test_report_id = None

    def log(self, message):
        print(f"[{datetime.now().strftime('%H:%M:%S')}] {message}")

    def run_test(self, name, method, endpoint, expected_status, data=None, headers=None):
        """Run a single API test"""
        url = f"{self.base_url}/api/{endpoint}"
        test_headers = {'Content-Type': 'application/json'}
        if headers:
            test_headers.update(headers)

        self.tests_run += 1
        self.log(f"🔍 Testing {name}...")
        
        try:
            if method == 'GET':
                response = self.session.get(url, headers=test_headers)
            elif method == 'POST':
                response = self.session.post(url, json=data, headers=test_headers)
            elif method == 'PATCH':
                response = self.session.patch(url, json=data, headers=test_headers)
            elif method == 'DELETE':
                response = self.session.delete(url, headers=test_headers)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                self.log(f"✅ {name} - Status: {response.status_code}")
                try:
                    return True, response.json() if response.content else {}
                except:
                    return True, {}
            else:
                self.log(f"❌ {name} - Expected {expected_status}, got {response.status_code}")
                try:
                    error_detail = response.json().get('detail', 'No detail')
                    self.log(f"   Error: {error_detail}")
                except:
                    self.log(f"   Response: {response.text[:200]}")
                return False, {}

        except Exception as e:
            self.log(f"❌ {name} - Error: {str(e)}")
            return False, {}

    def test_auth_flow(self):
        """Test complete authentication flow"""
        self.log("\n🔐 Testing Authentication Flow...")
        
        # Test admin login
        success, response = self.run_test(
            "Admin Login",
            "POST",
            "auth/login",
            200,
            data=self.admin_credentials
        )
        
        if not success:
            self.log("❌ Admin login failed - stopping auth tests")
            return False
            
        # Test get current user
        success, user_data = self.run_test(
            "Get Current User",
            "GET", 
            "auth/me",
            200
        )
        
        if success and user_data.get('role') == 'admin':
            self.log(f"✅ Admin user verified: {user_data.get('email')}")
        
        # Test user registration
        test_user = {
            "email": f"test_user_{int(time.time())}@test.com",
            "password": "TestPass123!",
            "name": "Test User"
        }
        
        success, reg_response = self.run_test(
            "User Registration",
            "POST",
            "auth/register", 
            200,
            data=test_user
        )
        
        if success:
            self.test_user_id = reg_response.get('_id')
            self.log(f"✅ Test user created: {test_user['email']}")
        
        # Test logout
        success, _ = self.run_test(
            "Logout",
            "POST",
            "auth/logout",
            200
        )
        
        # Test login with new user
        success, _ = self.run_test(
            "Test User Login",
            "POST",
            "auth/login",
            200,
            data={"email": test_user["email"], "password": test_user["password"]}
        )
        
        # Test brute force protection
        self.log("🔒 Testing brute force protection...")
        for i in range(6):  # Try 6 failed attempts
            success, _ = self.run_test(
                f"Failed Login Attempt {i+1}",
                "POST",
                "auth/login",
                401 if i < 5 else 429,  # Should get 429 (Too Many Requests) on 6th attempt
                data={"email": test_user["email"], "password": "wrong_password"}
            )
        
        # Login back as admin for other tests
        success, _ = self.run_test(
            "Admin Re-login",
            "POST", 
            "auth/login",
            200,
            data=self.admin_credentials
        )
        
        return success

    def test_crime_prediction(self):
        """Test crime prediction with AI integration"""
        self.log("\n🤖 Testing Crime Prediction...")
        
        prediction_data = {
            "location": "New York, NY",
            "latitude": 40.7128,
            "longitude": -74.0060,
            "date": "2024-12-01",
            "time": "14:30",
            "crime_type": "theft"
        }
        
        success, response = self.run_test(
            "Crime Prediction",
            "POST",
            "predict",
            200,
            data=prediction_data
        )
        
        if success:
            required_fields = ['probability', 'risk_level', 'analysis', 'factors']
            for field in required_fields:
                if field in response:
                    self.log(f"✅ Prediction contains {field}: {response[field]}")
                else:
                    self.log(f"❌ Missing field in prediction: {field}")
                    return False
            
            # Validate risk level
            if response.get('risk_level') in ['Low', 'Medium', 'High']:
                self.log(f"✅ Valid risk level: {response['risk_level']}")
            else:
                self.log(f"❌ Invalid risk level: {response.get('risk_level')}")
                return False
                
            # Validate probability range
            prob = response.get('probability', 0)
            if 0 <= prob <= 100:
                self.log(f"✅ Valid probability: {prob}%")
            else:
                self.log(f"❌ Invalid probability: {prob}")
                return False
        
        return success

    def test_reports_flow(self):
        """Test complete reports functionality"""
        self.log("\n📋 Testing Reports Flow...")
        
        # Create a report
        report_data = {
            "title": "Test Crime Report",
            "description": "This is a test crime report for API testing",
            "location": "Test Location, NY",
            "latitude": 40.7128,
            "longitude": -74.0060,
            "date": "2024-12-01",
            "image": None
        }
        
        success, response = self.run_test(
            "Create Report",
            "POST",
            "reports",
            200,
            data=report_data
        )
        
        if success:
            self.test_report_id = response.get('id')
            self.log(f"✅ Report created with ID: {self.test_report_id}")
        
        # Get reports
        success, reports = self.run_test(
            "Get Reports",
            "GET",
            "reports",
            200
        )
        
        if success and isinstance(reports, list):
            self.log(f"✅ Retrieved {len(reports)} reports")
        
        # Update report status (admin only)
        if self.test_report_id:
            success, _ = self.run_test(
                "Update Report Status",
                "PATCH",
                f"reports/{self.test_report_id}/status",
                200,
                data={"status": "approved"}
            )
        
        return success

    def test_analytics(self):
        """Test analytics endpoints"""
        self.log("\n📊 Testing Analytics...")
        
        # Test stats
        success, stats = self.run_test(
            "Analytics Stats",
            "GET",
            "analytics/stats",
            200
        )
        
        if success:
            required_stats = ['total_users', 'total_reports', 'total_predictions', 'pending_reports', 'risk_distribution']
            for stat in required_stats:
                if stat in stats:
                    self.log(f"✅ Stats contains {stat}: {stats[stat]}")
                else:
                    self.log(f"❌ Missing stat: {stat}")
        
        # Test trends
        success, trends = self.run_test(
            "Crime Trends",
            "GET", 
            "analytics/trends",
            200
        )
        
        if success and isinstance(trends, list):
            self.log(f"✅ Retrieved {len(trends)} trend data points")
        
        # Test heatmap
        success, heatmap = self.run_test(
            "Crime Heatmap",
            "GET",
            "analytics/heatmap", 
            200
        )
        
        if success and isinstance(heatmap, list):
            self.log(f"✅ Retrieved {len(heatmap)} heatmap data points")
        
        return success

    def test_admin_functionality(self):
        """Test admin-only endpoints"""
        self.log("\n👑 Testing Admin Functionality...")
        
        # Get all users
        success, users = self.run_test(
            "Get All Users",
            "GET",
            "admin/users",
            200
        )
        
        if success and isinstance(users, list):
            self.log(f"✅ Retrieved {len(users)} users")
            
            # Find a non-admin user to test deletion
            non_admin_user = None
            for user in users:
                if user.get('role') != 'admin' and user.get('_id') != self.test_user_id:
                    non_admin_user = user
                    break
            
            # Test user deletion (only if we have a non-admin user)
            if non_admin_user:
                success, _ = self.run_test(
                    "Delete User",
                    "DELETE",
                    f"admin/users/{non_admin_user['_id']}",
                    200
                )
        
        return success

    def test_notifications(self):
        """Test notifications functionality"""
        self.log("\n🔔 Testing Notifications...")
        
        # Get notifications
        success, notifications = self.run_test(
            "Get Notifications",
            "GET",
            "notifications",
            200
        )
        
        if success and isinstance(notifications, list):
            self.log(f"✅ Retrieved {len(notifications)} notifications")
            
            # Test marking notification as read (if any exist)
            if notifications:
                notif_id = notifications[0].get('id')
                if notif_id:
                    success, _ = self.run_test(
                        "Mark Notification Read",
                        "PATCH",
                        f"notifications/{notif_id}/read",
                        200
                    )
        
        return success

    def test_password_reset_flow(self):
        """Test password reset functionality"""
        self.log("\n🔑 Testing Password Reset Flow...")
        
        # Test forgot password
        success, _ = self.run_test(
            "Forgot Password",
            "POST",
            "auth/forgot-password",
            200,
            data={"email": "admin@crime.com"}
        )
        
        # Note: We can't test the full reset flow without email access
        # but we can test the endpoint exists and responds correctly
        
        return success

    def cleanup(self):
        """Clean up test data"""
        self.log("\n🧹 Cleaning up test data...")
        
        # Delete test report if created
        if self.test_report_id:
            success, _ = self.run_test(
                "Delete Test Report",
                "DELETE",
                f"reports/{self.test_report_id}",
                200
            )
        
        # Delete test user if created
        if self.test_user_id:
            success, _ = self.run_test(
                "Delete Test User",
                "DELETE",
                f"admin/users/{self.test_user_id}",
                200
            )

    def run_all_tests(self):
        """Run all API tests"""
        self.log("🚀 Starting Crime Prediction API Tests...")
        self.log(f"Backend URL: {self.base_url}")
        
        try:
            # Test authentication first
            if not self.test_auth_flow():
                self.log("❌ Authentication tests failed - stopping")
                return False
            
            # Test core functionality
            self.test_crime_prediction()
            self.test_reports_flow()
            self.test_analytics()
            self.test_admin_functionality()
            self.test_notifications()
            self.test_password_reset_flow()
            
            # Cleanup
            self.cleanup()
            
        except Exception as e:
            self.log(f"❌ Test suite error: {str(e)}")
            return False
        
        # Print results
        success_rate = (self.tests_passed / self.tests_run) * 100 if self.tests_run > 0 else 0
        self.log(f"\n📊 Test Results: {self.tests_passed}/{self.tests_run} passed ({success_rate:.1f}%)")
        
        if success_rate >= 80:
            self.log("✅ Backend API tests PASSED")
            return True
        else:
            self.log("❌ Backend API tests FAILED")
            return False

def main():
    tester = CrimePredictionAPITester()
    success = tester.run_all_tests()
    return 0 if success else 1

if __name__ == "__main__":
    sys.exit(main())