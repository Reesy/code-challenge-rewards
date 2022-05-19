
export default interface Reward
{
    availableAt: Date;
    redeemedAt: Date | null;
    expiresAt: Date;
}