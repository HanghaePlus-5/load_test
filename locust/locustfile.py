from locust import HttpUser, task
import json
import math
import random
import time

class plus_load(HttpUser):
    @task
    def plus_load(self):
        now = math.floor(time.time() * 100000)
        rand = math.floor(random.random() * 100000)
        uid = str(now)[7:] + str(rand)

        # usertype = random.choice(['BUSINESS', 'CUSTOMER'])
        usertype = 'CUSTOMER'
        signup_form = {
            'email': f'user_{uid}@plus.com',
            'name': f'user_{uid}',
            'password': 'qwe123123',
            'type': usertype
        }
        headers = {
            'content-type': 'application/json'
        }
        self.client.post('/api/v1/users/signup', data=json.dumps(signup_form), headers=headers)

        time.sleep(random.random() * 5)
        
        login_form = {
            'email': f'user_{uid}@plus.com',
            'password': 'qwe123123'
        }
        res = self.client.post('/api/v1/users/signin', data=json.dumps(login_form), headers=headers)
        access_token = res.cookies.get('accessToken')

        time.sleep(random.random() * 5)

        headers = {
            'content-type': 'application/json',
            'authorization': f'Bearer {access_token}'
        }
        res = self.client.get('/api/v1/stores/search?keyword=&page=1&limit=10', headers=headers)
        store_data = res.json()
        store = random.choice(store_data['data'])

        time.sleep(random.random() * 5)

        order_form = {
            'storeId': store['storeId'],
            'orderItem': [
            {
                'quantity': math.floor(random.random() * 10) + 1,
                'menuId': random.choice(store['menus'])['menuId'],
            },
            {
                'quantity': math.floor(random.random() * 10) + 1,
                'menuId': random.choice(store['menus'])['menuId'],
            },
            ],
        }
        data = json.dumps(order_form)
        self.client.post('/api/v1/orders', data=data, headers=headers)