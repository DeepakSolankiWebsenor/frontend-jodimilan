/**
 * Determines if the profile photo should be shown clearly or blurred.
 *
 * @param {Object} targetUser - The user whose photo is being viewed (should include photo_privacy).
 * @param {Object} viewerUser - The current logged-in user (should include package_id).
 * @param {string} context - The context of the view: 'public', 'pending', 'friend', 'self'.
 * @returns {boolean} - Returns true if photo should be visible (clear), false if blurred.
 */
export const shouldShowPhoto = (targetUser, viewerUser, context = 'public') => {
    if (!targetUser) return false;

    // 1. If viewing own profile, always show
    if (context === 'self') return true;

    // 2. If target has no privacy set or set to "Yes" (Show to all), show it
    // Some responses might have it on 'profile' object, so we expect the caller to pass a consolidated object or we check both if needed.
    // However, usually we expect targetUser to have the flattened properties or the caller to pass the specific privacy string.
    // Let's assume targetUser contains the 'photo_privacy' property directly or in a profile sub-object.
    const privacy = targetUser.photo_privacy || targetUser?.profile?.photo_privacy || "Yes";
    
    if (privacy === "Yes") return true;

    // 3. Privacy is "No" (Restricted)
    
    // a. If viewer has active membership
    // Check for package_id AND ensure plan hasn't expired (if plan_expire field exists and is truthy, it means expired)
    // Some objects structure it as user.plan_expire or directly plan_expire.
    const hasMembership = (viewerUser?.package_id || viewerUser?.user?.package_id) && 
                          !(viewerUser?.plan_expire || viewerUser?.user?.plan_expire);

    if (hasMembership) return true;

    // b. If context is 'friend', show it
    if (context === 'friend') return true;

    // Otherwise, hide/blur
    return false;
};
