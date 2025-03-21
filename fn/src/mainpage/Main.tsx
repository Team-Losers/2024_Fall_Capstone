import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Dimensions} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {StackNavigationProp} from '@react-navigation/stack';
import {useUserStore} from '../store/userStore';
import AllergyRegistration from '../components/AllergyRegistration';
import LinearGradient from 'react-native-linear-gradient';
import {BlurView} from '@react-native-community/blur';
import BodyInfoRegistration from '../components/BodyInfoRegistration';
import api from '../api/axiosConfig';
import WeightRegistration from '../components/WeightRegistration';
import FoodInput from '../components/FoodInput';

type RootStackParamList = {
  Main: undefined;
  Profile: undefined;
  FoodInput: undefined;
  ChatRoom: undefined;
  ChartPage: undefined;
  WorkoutRecommend: undefined;
};

interface UserState {
  userInfo: {
    registered_allergy: boolean;
    name?: string;
    email?: string;
    age?: number;
    height?: number;
    weight?: number;
    gender?: 'male' | 'female' | 'other';
    allergies?: string[];
  } | null;
  fetchUserInfo: () => Promise<void>;
}

const {width} = Dimensions.get('window');

export default function Main(): React.ReactElement {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [allergyModalVisible, setAllergyModalVisible] = useState(false);
  const userInfo = useUserStore(state => state.userInfo);
  const fetchUserInfo = useUserStore(state => state.fetchUserInfo);
  const [showBodyInfoModal, setShowBodyInfoModal] = useState(false);
  const [showWeightModal, setShowWeightModal] = useState(false);
  const [foodModalVisible, setFoodModalVisible] = useState(false);

  const handleAllergyClose = () => {
    console.log('Allergy modal closed');
    setAllergyModalVisible(false);
    if (!userInfo?.registered_body_info) {
      console.log('Opening body info modal');
      setShowBodyInfoModal(true);
    }
  };

  useEffect(() => {
    const checkUserStatusSequentially = async () => {
      try {
        console.log('Checking allergies...');
        const allergyResponse = await api.get('food/user_allergy');
        console.log('Allergies:', allergyResponse.data);
        if (allergyResponse.data.allergies.length === 0) {
          setAllergyModalVisible(true);
          return; // 이후 단계를 실행하지 않고 종료
        }

        console.log('Checking body info...');
        const bodyInfoResponse = await api.get('exercise/body_info');
        console.log('Body Info:', bodyInfoResponse.data);
        if (bodyInfoResponse.data.body_info && bodyInfoResponse.data.body_info.length === 0) {
          setShowBodyInfoModal(true);

          return; // 이후 단계를 실행하지 않고 종료
        }

        console.log('Checking weight...');
        const weightResponse = await api.get('/exercise/weight');

        console.log('Weight:', weightResponse.data);
        if (weightResponse.data.weights && weightResponse.data.weights.length > 0) {
          const latestDate = new Date(weightResponse.data.weights[0].date);
          const today = new Date();
          const diffDays = Math.floor(
            (today.getTime() - latestDate.getTime()) / (1000 * 60 * 60 * 24),
          );

          if (diffDays >= 5) {
            setShowWeightModal(true);
          }
        } else {
          setShowWeightModal(true);
        }
      } catch (error: any) {
        console.error('Error during sequential checks:', error);
      }
    };

    checkUserStatusSequentially();
  }, []);

  const menuItems = [
    {
      title: 'Food Tracking',
      subtitle: 'Record your meals',
      icon: 'food-apple',
      onPress: () => setFoodModalVisible(true),
      gradient: ['#f213d2', '#023de2'],
    },
    {
      title: 'Meal Planner',
      subtitle: 'Get recommendations',
      icon: 'silverware-fork-knife',
      onPress: () => navigation.navigate('ChatRoom'),
      gradient: ['#23123e', '#b11756'],
    },
    {
      title: 'Workout',
      subtitle: 'Exercise guide',
      icon: 'dumbbell',
      onPress: () => navigation.navigate('WorkoutRecommend'),
      gradient: ['#4ECDC4', '#21113e'],
    },
    {
      title: 'Progress',
      subtitle: 'View your stats',
      icon: 'chart-line',
      onPress: () => navigation.navigate('ChartPage'),
      gradient: ['#ff7171', '#128d8e'],
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerButton}>
          <Icon
            onPress={() => navigation.goBack()}
            name='arrow-left'
            size={28}
            color='#ffffff'
            style={styles.icon}
          />
        </TouchableOpacity>
        {/* <Text style={styles.headerTitle}>FLEX</Text> */}
        <TouchableOpacity
          onPress={() => navigation.navigate('Profile')}
          style={styles.headerButton}
        >
          <Icon name='account' size={28} color='#ffffff' style={styles.icon} />
        </TouchableOpacity>
      </View>

      <View style={styles.welcomeSection}>
        <Text style={styles.welcomeText}>Hello, {userInfo?.name || 'User'}!</Text>
        <Text style={styles.welcomeSubtext}>Ready to achieve your goals?</Text>
      </View>

      <View style={styles.container}>
        {menuItems.map((item, index) => (
          <TouchableOpacity key={index} onPress={item.onPress} style={styles.menuItem}>
            <BlurView
              style={styles.blurContainer}
              blurType='dark'
              blurAmount={10}
              reducedTransparencyFallbackColor='transparent'
            >
              <LinearGradient
                colors={[`${item.gradient[0]}50`, `${item.gradient[1]}50`]}
                style={styles.gradientBox}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 1}}
              >
                <Icon name={item.icon} size={32} color='#ffffff' />
                <View style={styles.menuTextContainer}>
                  <Text style={styles.menuTitle}>{item.title}</Text>
                  <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
                </View>
              </LinearGradient>
            </BlurView>
          </TouchableOpacity>
        ))}
      </View>

      <AllergyRegistration visible={allergyModalVisible} onClose={handleAllergyClose} />

      <BodyInfoRegistration
        visible={showBodyInfoModal}
        onClose={() => setShowBodyInfoModal(false)}
      />
      <WeightRegistration visible={showWeightModal} onClose={() => setShowWeightModal(false)} />
      <FoodInput visible={foodModalVisible} onClose={() => setFoodModalVisible(false)} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#1A1A1A',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#1A1A1A',
  },
  headerButton: {
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: 'System',
  },
  welcomeSection: {
    padding: 20,
    marginBottom: 10,
  },
  welcomeText: {
    color: '#ffffff',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  welcomeSubtext: {
    color: '#9E9E9E',
    fontSize: 16,
  },
  container: {
    flex: 1,
    padding: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  menuItem: {
    width: (width - 40) / 2,
    height: 160,
    margin: 5,
    overflow: 'hidden',
    borderRadius: 20,
  },
  blurContainer: {
    flex: 1,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  gradientBox: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  // menuTextContainer: {
  //   marginTop: 'auto',
  //   backgroundColor: 'rgba(0, 0, 0, 0.2)',
  //   padding: 10,
  //   borderRadius: 10,
  // },
  menuTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 3,
  },
  menuSubtitle: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 3,
  },
  icon: {
    width: 28,
    height: 28,
    textAlign: 'center',
  },
});
