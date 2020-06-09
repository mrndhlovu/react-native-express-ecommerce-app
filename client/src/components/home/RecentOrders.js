import React from 'react';
import {View, Text} from 'react-native';
import {STYLES} from '../../utils/styleUtils';

const RecentOrders = ({orders}) => {
  return !orders ? (
    <View style={STYLES.recentOrders}>
      <View style={STYLES.noOrders}>
        <Text style={STYLES.noOrdersText}>
          After making your first order you will be able to see you recent
          orders here!
        </Text>
      </View>
    </View>
  ) : (
    <View>
      <Text>Recent Orders</Text>
      {orders.map(order => {})}
    </View>
  );
};

export default RecentOrders;
