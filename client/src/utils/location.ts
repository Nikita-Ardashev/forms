export const getLocation = () => {
	return new Promise<{ lat: number; lng: number }>((resolve, reject) => {
		navigator.geolocation.getCurrentPosition(
			(position) => {
				resolve({
					lat: position.coords.latitude,
					lng: position.coords.longitude,
				});
			},
			(e) => {
				reject(e);
			},
			{
				timeout: 10000,
				maximumAge: 60000,
				enableHighAccuracy: true,
			},
		);
	});
};
