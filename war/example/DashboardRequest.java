package com.byjoul.code.zenbus.servlets.api;

import com.byjoul.code.lib.geo.model.shape.TrailShapeInfo;
import com.byjoul.code.lib.json.JsonSpawn;
import com.byjoul.code.zenbus.data.TrailProvider;
import com.byjoul.code.zenbus.data.ZenbusAccount;

public class DashboardRequest implements JsonSpawn{
	/**
	 * Eclipse auto generated
	 */
	private static final long serialVersionUID = 1661519535790009633L;
	
	/**
	 * Account updates
	 */
	public ZenbusAccount account;
	
	/**
	 * List of providers updated
	 */
	public TrailProvider[] providers;
	
	/**
	 * Not null when a request for a new provider is required
	 */
	public OneTimeSyncProviderRequest syncRequest;
	
	public TrailShapeInfo[] shapes;
	public PointOfInterestInfo[] pois;
	public MissionInfo[] missions;
	public String[] shapesDeleted;
	public String[] poisDeleted;
	public String[] missionsDeleted;
	
	public boolean updateProviders(){
		return providers != null && providers.length > 0;
	}
	
	public boolean updateAccount(){
		return account != null;
	}
	
	public boolean updateOpenData(){
		return (shapes != null && shapes.length > 0)
				|| (pois != null && pois.length > 0)
				|| (missions != null && missions.length > 0)
				|| (shapesDeleted != null && shapesDeleted.length > 0)
				|| (poisDeleted != null && poisDeleted.length > 0)
				|| (missionsDeleted != null && missionsDeleted.length > 0);
	}
	
	public boolean needOneTimeToken(){
		return syncRequest != null && syncRequest.isValid();
	}
	
	@Override
	public boolean isValid() {
		return updateProviders() || updateAccount() || updateOpenData() || needOneTimeToken();
	}
}
