export const API_URL = import.meta.env.VITE_API_DOMAIN;

export class Api {
	private async get(path: string): Promise<any> {
		const res = await fetch(API_URL+path, {
			method: 'get',
			headers: {
				Authorization: `${localStorage.getItem('id_token')}`
			}
		});
		const body = await res.json();

		if (!res.ok){
			throw new Error(JSON.stringify(body.values || [body]));
		}

		return body;
	}

	async myImages(): Promise<any[]> {
		let res = await this.get("/myimages");
		res.forEach(function(value,index){
			res[index].url = API_URL + "/images/" + value.ImageID;
		});
		return res;
	}
}
