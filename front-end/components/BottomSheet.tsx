import {
  Alert,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import BottomSheet, {
  BottomSheetFlatList,
  BottomSheetScrollView,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { Colors } from "@/constants/Colors";
import { AntDesign, FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import { comments } from "@/constants/db";
import { ProductType } from "@/interfaces/productType";
import { useCart } from "@/hooks/useCart";
import { useEffect, useState } from "react";
import useCountStore from "@/hooks/useCountStore";
import { addCart, getOneProduct } from "@/api/secured";
import { rootStyle } from "@/constants/Style";

type Props = {
  bottomSheetRef: any;
  snapPoints: any;
  product: ProductType;
};

type Comment = {
  id: number;
  avatar: string;
  name: string;
  comment: string;
};

type DataItem = Comment | { key: string };

function BottomSheetComponent({ bottomSheetRef, snapPoints, product }: Props) {
  const { carts } = useCart();
  const [existCartItem, setExistCartItem] = useState<boolean>(false);
  const { increment } = useCountStore() as {
    increment: () => void;
  };

  useEffect(() => {
    const productId = product?.id;

    const foundItem = carts.find((item) => {
      return item.product.id === productId;
    });

    if (foundItem !== undefined) {
      setExistCartItem(true);
    } else {
      setExistCartItem(false);
    }
  }, [product, carts]);

  const handleSaveProduct = async (id: string | undefined) => {
    const data = {
      product_id: id,
      quantity: 1,
    };

    const response = await addCart(data);
    setExistCartItem(true);

    if (response !== undefined) {
      Alert.alert("Success", "Product added to cart successfully");
      increment();
    } else {
      Alert.alert("Error", "Product already in cart");
    }
  };
  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={0}
      snapPoints={snapPoints}
      enablePanDownToClose={false}
    >
      <View style={styles.contentContainer}>
        <View style={{ flexDirection: "row", gap: 10, marginBottom: 10 }}>
          <View style={styles.imgContainer}>
            <Image source={{ uri: product?.img }} style={styles.img} />
          </View>
          <View style={{ justifyContent: "flex-end" }}>
            <Text style={styles.itemName}>{product?.name}</Text>
            <View style={styles.locationstar}>
              <Text style={{ color: "gray" }}>{product?.category.name}</Text>
            </View>
            <View style={styles.locationstar}>
              <AntDesign name="star" size={20} color="#FFBF00" />
              <Text style={styles.starText}>5</Text>
            </View>
            <View style={styles.locationstar}>
              <FontAwesome5 name="money-bill-wave" size={20} color="white" />
              <Text style={styles.priceText}>{product?.price.toFixed(3)}</Text>
            </View>
          </View>
        </View>

        <View style={{ marginTop: 10 }}>
          <TouchableOpacity
            onPress={() => handleSaveProduct(product?.id)}
            disabled={existCartItem}
            style={[
              rootStyle.btnPrimary,
              existCartItem && {
                backgroundColor: "red",
              },
            ]}
          >
            <Text style={rootStyle.textBtnPrimary}>
              {existCartItem ? "Product Saved" : "Save Product"}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.commentsHeader}>
          <FontAwesome name="comments-o" size={18} color="gray" />
          <Text style={styles.commentsHeaderText}>Comments</Text>
        </View>

        <BottomSheetFlatList
          data={[{ key: "location" }, ...comments] as DataItem[]}
          renderItem={({ item }) => {
            if ("key" in item) {
              return (
                <View>
                  <View style={styles.locationStore}>
                    <FontAwesome5 name="store" size={15} color="gray" />
                    <Text style={styles.locationText}>{product?.store}</Text>
                  </View>
                  <View style={{ marginTop: 10 }}>
                    <Text style={styles.descriptionText}>
                      Lorem ipsum dolor sit amet consectetur adipisicing elit.
                      Quibusdam optio ipsam doloribus praesentium ipsa
                      consequatur unde pariatur quos quis dolore!
                    </Text>
                  </View>
                  <View style={styles.commentsHeader}>
                    <FontAwesome name="comments-o" size={18} color="gray" />
                    <Text style={styles.commentsHeaderText}>Comments</Text>
                  </View>
                </View>
              );
            }
            return (
              <View key={item.id} style={styles.commentContainer}>
                <View style={styles.topContainer}>
                  <View style={styles.imgWrapper}>
                    <Image
                      source={{ uri: item.avatar }}
                      style={styles.avatar}
                    />
                  </View>
                  <Text style={styles.commentName}>{item.name}</Text>
                </View>
                <Text style={styles.commentText}>{item.comment}</Text>
              </View>
            );
          }}
          keyExtractor={(item) =>
            "key" in item ? item.key : item.id.toString()
          }
        />
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    backgroundColor: "black",
    paddingTop: 15,
    paddingHorizontal: 10,
  },
  imgContainer: {
    width: 200,
    height: 200,
    backgroundColor: Colors.semiDark,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  img: {
    width: 170,
    height: 180,
  },
  locationstar: {
    flexDirection: "row",
    gap: 2,
    marginTop: 10,
    alignItems: "center",
  },
  locationStore: {
    flexDirection: "row",
    gap: 5,
    marginTop: 10,
    alignItems: "center",
  },
  priceText: {
    color: "white",
    fontSize: 20,
  },
  descriptionText: {
    color: "white",
    fontSize: 16,
    lineHeight: 22,
  },
  locationText: {
    color: "gray",
    fontSize: 15,
  },
  commentContainer: {
    marginVertical: 6,
    backgroundColor: Colors.semiDark,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 15,
  },
  starText: {
    color: "#FFBF00",
    fontSize: 20,
  },
  commentsHeader: {
    marginVertical: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    position: "relative",
  },
  commentsHeaderText: {
    color: "gray",
  },
  topContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 10,
  },
  imgWrapper: {
    overflow: "hidden",
    width: 50,
    height: 50,
    borderRadius: 100,
  },
  itemName: {
    color: "white",
    fontFamily: "bold",
    fontSize: 22,
    lineHeight: 23,
    width: 140,
  },
  avatar: {
    width: 50,
    height: 50,
  },
  commentName: {
    color: "white",
    fontSize: 15,
  },
  commentText: {
    color: "white",
  },
});

export default BottomSheetComponent;
