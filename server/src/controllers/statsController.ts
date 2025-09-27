import { asyncHandler } from '@/utils/asyncHandler';

const stats = asyncHandler(async (req, res) => {
	res.send();
});

const statsController = { stats };

export default statsController;
