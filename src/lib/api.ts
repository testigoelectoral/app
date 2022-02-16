
export default class Api {
	private API_URL = import.meta.env.VITE_API_DOMAIN;

	async upload(location:any,qrcode: string,userHash: string,imageRaw: any): Promise<any[]> {
		let headers = {
			'X-Amz-Meta-Accuracy': location.accuracy,
			'X-Amz-Meta-Latitude': location.latitude,
			'X-Amz-Meta-Longitude': location.longitude,
			'X-Amz-Meta-User-Hash': userHash,
			'X-Amz-Meta-Qr-Code': qrcode,
			'Content-Type': imageRaw.type,
		}
		return this.put("/myimages",headers,imageRaw);
	}

	async image(imageid:string): Promise<any> {
		let info = await this.get("/myimages/"+imageid);
		let votes = await this.get("/myimages/"+imageid+"/votes");
		return {
			"info":info,
			"votes": votes[0] ? votes[0].Votes : {},
			"url":  this.API_URL + "/images/" + imageid
		};
	}

	async report(imageid:string,votes:any): Promise<any> {
		return await this.put(
			"/myimages/"+imageid+"/votes",
			{'Content-Type': 'application/json'},
			{votes:votes}
		);
	}

	async myImages(): Promise<any[]> {
		let res = await this.get("/myimages");
		const apiurl = this.API_URL;
		res.forEach(function(value: any,index: number){
			res[index].url = apiurl + "/images/" + value.ImageID;
		});
		return res;
	}

	private async put(path: string,headers:any={},body:any=undefined): Promise<any> {
		return await this.call("put",path,headers,body);
	}

	private async get(path: string,headers:any={}): Promise<any> {
		return await this.call("get",path,headers);
	}

	private async call(method:string, path: string,headers:any={}, bodyRequest:any=undefined): Promise<any>{
		let fetchOptions = {
			method: method,
			headers:headers
		};

		fetchOptions.headers["Authorization"]=localStorage.getItem('id_token');

		if(bodyRequest){
			if (headers['Content-Type'] == 'application/json'){
				fetchOptions["body"]=JSON.stringify(bodyRequest);

			}else{
				fetchOptions["body"]=bodyRequest;
			}			
		}

		const res = await fetch(this.API_URL+path, fetchOptions);

		const string = await res.text();
		const json = string === "" ? {} : JSON.parse(string); // Fix for empty body responses

		if (!res.ok){
			throw new Error(JSON.stringify(json));
		}
		// console.log(json);
		return json;
	}
}
