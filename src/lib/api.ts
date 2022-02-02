export default class Api {
  private url = 'https://api-dev.testigoelectoral.org/'
	private toLogin() {
		window.location.href = '/';
	}

	private async get(path: string): Promise<any> {
		const res = await fetch(path, {
			method: 'get',
			headers: {
				Authorization: `${localStorage.getItem('id_token')}`
			}
		});
		if (res.status === 401) {
			this.toLogin();
			return;
		}
		const body = await res.json();
		if ([200, 201, 202].indexOf(res.status) === -1) {
			throw new Error(JSON.stringify(body.values || [body]));
		}
		return body;
	}
	private async post(path: string, bodyObj: any): Promise<any> {
		const res = await fetch(path, {
			method: 'post',
			headers: {
				Authorization: `${localStorage.getItem('id_token')}`
			},
			body: JSON.stringify(bodyObj)
		});
		if (res.status === 401) {
			this.toLogin();
			return;
		}
		const body = await res.json();
		if ([200, 201, 202].indexOf(res.status) === -1) {
			throw new Error(JSON.stringify(body.values || [body]));
		}
		return body;
	}
	private async put(path: string, bodyObj: any): Promise<any> {
		const res = await fetch(path, {
			method: 'put',
			headers: {
				Authorization: `${localStorage.getItem('id_token')}`
			},
			body: JSON.stringify(bodyObj)
		});
		if (res.status === 401) {
			this.toLogin();
			return;
		}
		const body = await res.json();
		if ([200, 201, 202].indexOf(res.status) === -1) {
			throw new Error(JSON.stringify(body.values || [body]));
		}
		return body;
	}
	private async delete(path: string): Promise<any> {
		const res = await fetch(path, {
			method: 'delete',
			headers: {
				Authorization: `${localStorage.getItem('id_token')}`
			}
		});
		if (res.status === 401) {
			this.toLogin();
			return;
		}
		const body = await res.json();
		if ([200, 201, 202].indexOf(res.status) === -1) {
			throw new Error(JSON.stringify(body.values));
		}
		return body;
	}
  async myImages(): Promise<any[]> {
      return await this.get(`${this.url}myimages`);
  }
}
