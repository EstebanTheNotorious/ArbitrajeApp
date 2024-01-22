import { requestValdationToken } from "../axios/axios";


export const FindProvince = async (email) => {
    let province;
    await requestValdationToken(`Utils/GetUserProvince/${email}`).then(res => {
        console.log('res province', res)
        if (res.data.statusCode === 200 && res.data.result) province = res.data.result.id;
    }).catch(err => {
        console.error('[*] =========================> [*] ERROR GET USER PROVINCE', err);
        province = null;
    })
    return province;
}